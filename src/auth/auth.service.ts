import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { Token } from '../graphql';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
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
    return {
      accessToken: this.jwtService.sign(payload),
    }
  }

  async isInvalidToken(token: string): Promise<any> {
    return await this.jwtService.verify(token)
  }

  async decodeToken(token: string) : Promise<any> {
    return await this.jwtService.decode(token)
  }
}
