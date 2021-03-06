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
import { LogModule } from './log/log.module';
import { OssModule } from './oss/oss.module';

import { RedisModule} from 'nestjs-redis'

@Module({
  imports: [
    RedisModule.register({
      name: 'redis-1',
      url: 'redis://127.0.0.1:6379'
    }),
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
      logging: true, // 开始sql打印
      logger: 'advanced-console', // 高亮字体的打印信息
      extra: {
        connectionLimit:  10,// 连接池最大连接数量, 查阅资料 建议是  core number  * 2 + n
      },
      cache: {
        type: 'redis',
        options: {
          host: 'localhost',
          port: 6379,
          username: '',
          password:'',
          db: 0, // 这个任君选择，0～15库都可以选
        }
      }
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
