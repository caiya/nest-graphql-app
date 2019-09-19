import { AuthGuard } from "@nestjs/passport";
import { Injectable, ExecutionContext, UnauthorizedException, ReflectMetadata } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";

import { ExtractJwt } from 'passport-jwt';
import { AuthService } from "./auth.service";
import { Token } from "../graphql";
import { ModuleRef } from "@nestjs/core";

import {TokenExpiredError } from 'jsonwebtoken'
import { RedisService } from "nestjs-redis";

@Injectable()
export class GqlJwtAuthGuard extends AuthGuard('jwt') {

  constructor(private readonly authService: AuthService, private readonly moduleRef: ModuleRef, private readonly redisService: RedisService) {
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
    const payload = await this.authService.decodeToken(token)
    if (!payload) {
      throw new UnauthorizedException('token无效')
    }
    try {
      // 如果token有效，再判断当前已登录的设备中有无该token
      let client = this.redisService.getClient()
      let hasExist = !!(await client.sismember(`user:login:${payload.sub}`, token))
      if (!hasExist) {
        throw new UnauthorizedException('您的账号在其它设备已登录')
      }

      await this.authService.isInvalidToken(token)
      return await this.toCanActive(context);
    } catch (err) {
      if (err instanceof TokenExpiredError) {
        // 重新设置上下文的user，否则后面权限guard不识别还会拦截
        request.user = {
          id: payload.sub
        }
        const result: Token = await this.authService.login(request.user)
        console.log('新生成的token', result)
        request.headers['Authorization'] = `Bearer ${result.accessToken}`
        response.set({
          Authorization: `Bearer ${result.accessToken}`
        })
        // 直接返回true表示不进行拦截
        return true;
      }
      throw err
    }
  }

  async toCanActive(context: ExecutionContext): Promise<boolean> {
    return <Promise<boolean>>super.canActivate(context);
  }

  handleRequest(err, user, info) {
    // const userService = this.moduleRef.get(UsersService, {strict: false})
    // console.log('获取容器的userService', userService)
    if (err || !user) {
      throw err || new UnauthorizedException('token无效');
    }
    return user;
  }
}
