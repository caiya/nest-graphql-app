import { Module, CacheModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ArticlesModule } from './articles/articles.module';
import { PermitsModule } from './permits/permits.module';

import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path'
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth/auth.service';
import { LogModule } from './log/log.module';
import { OssModule } from './oss/oss.module';

@Module({
  imports: [
    CacheModule.register(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'test',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    GraphQLModule.forRoot({
      context: ({ req }) => ({ req }),
      debug: true, // debug模式
      playground: true, // graphql环境
      typePaths: ['./**/*.graphql'],
      definitions: {
        path: join(process.cwd(), 'src/graphql.ts'), // 默认转换为接口
      },
      installSubscriptionHandlers: false, // ws环境才能用到
    }),
    AuthModule, PermitsModule, ArticlesModule, UsersModule, LogModule, OssModule, 
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: []
})
export class AppModule {
}
