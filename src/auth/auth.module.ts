import { Module, Global } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';

@Global() // golbale的模块只需要导入service，不需要imports 模块
@Module({
  imports: [
    UsersModule,
    PassportModule.register({ property: 'user'}),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: 30 },
    }),
  ],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService, PassportModule],
})
export class AuthModule {}
