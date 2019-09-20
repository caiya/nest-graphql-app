import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { jwtConstants } from './constants';
import { UsersService } from '../users/users.service';
import { NestFactory, NestApplication, NestContainer, NestApplicationContext } from '@nestjs/core';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false, // 是否永不过期
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: any) {
    // console.log('jwt payload----', payload)
    return await this.usersService.findOneById(payload.sub);
  }
}
