import { AuthGuard } from "@nestjs/passport";
import { Injectable, ExecutionContext, UnauthorizedException, ReflectMetadata } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";

export const TokenExpiredErrorInfo = 'TokenExpiredError'
export const JwtExpiredErrorInfo = 'jwt expired'

import { ExtractJwt } from 'passport-jwt';
import { AuthService } from "./auth.service";
import { Token } from "../graphql";

@Injectable()
export class GqlJwtAuthGuard extends AuthGuard('jwt') {

  constructor(private readonly authService: AuthService) {
    super();
  }

  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }

  async canActivate(context: ExecutionContext) {
    const request = context.getArgByIndex(2).req;
    const response = request.res;
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(
      request,
    );
    try {
      await this.authService.isInvalidToken(token)
      return await this.toCanActive(context);
    } catch (TokenExpiredError) {
      if (TokenExpiredError.name === TokenExpiredErrorInfo) {
        const payload = await this.authService.decodeToken(token)
        const result: Token = await this.authService.login({
          id: payload.sub
        })
        // 重新设置上下文的user，否则后面权限guard不识别还会拦截
        request.user = {
          id: payload.sub
        }
        console.log('新生成的token', result)
        request.headers['Authorization'] = `Bearer ${result.accessToken}`
        response.set({
          Authorization: `Bearer ${result.accessToken}`
        })
        // 直接返回true表示不进行拦截
        return true;
      }
      return await this.toCanActive(context);
    }
  }

  async toCanActive(context: ExecutionContext): Promise<boolean> {
    return <Promise<boolean>>super.canActivate(context);
  }

  handleRequest(err, user, info) {
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
