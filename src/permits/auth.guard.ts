import { CanActivate, ExecutionContext, Injectable, Inject, forwardRef } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UsersService } from '../users/users.service';

@Injectable()
export class RequirePermitsGuard implements CanActivate {

  constructor(private readonly reflector: Reflector, private readonly userService: UsersService) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<any> {
    // 该操作所需要的权限
    const permits = this.reflector.get<string[]>('permits', context.getHandler());
    if (!permits) { // 如果权限为空，说明当前接口不需要任何权限即可访问
      return true;
    }
    console.log('当前接口要求 permits：', permits)
    // const user = request.user; // http请求
    let user = context.getArgByIndex(2).req.user;
    
    const userInfo = await this.userService.findOneById(user.id)
    user = userInfo;

    console.log('当前用户已分配 permits：', user.permits)

    user.permits = user.permits.split(',')

    console.log('当前user：', user)

    // 查询当前用户权限是否匹配
    const haspPermit = () => (user.permits || []).some((permit) => permits.includes(permit));
    return user && haspPermit();
  }
}
