import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { Token } from '../graphql';
import { RedisService } from 'nestjs-redis';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
  ) { }

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByName(username)
    if (user && user.password === pass) {
      const { password, permits, ...result } = user
      return result;
    }
    return null
  }

  async login(user: any): Promise<Token> {
    const payload = { sub: user.id }
    const token = this.jwtService.sign(payload)

    let client = this.redisService.getClient()
    client.del(`user:login:${user.id}`) // 先删除之前set集合
    client.sadd(`user:login:${user.id}`, token) // 将新的token放入set集合

    return {
      accessToken: token,
    }
  }

  async isInvalidToken(token: string): Promise<any> {
    return await this.jwtService.verify(token)
  }

  async decodeToken(token: string) : Promise<any> {
    return await this.jwtService.decode(token)
  }
}
