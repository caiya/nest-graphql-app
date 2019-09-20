import { Module, forwardRef } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/users.entity';
import { UsersResolvers } from './users.resolvers';
import { ArticlesModule } from '../articles/articles.module';
import { OssModule } from '../oss/oss.module';
import { Article } from '../articles/entity/articles.entity';

@Module({
  imports: [
    OssModule,
    TypeOrmModule.forFeature([User, Article]), forwardRef(() => ArticlesModule)],
    providers: [UsersService, UsersResolvers],
    exports: [UsersService],
    controllers: [UsersController],
})
export class UsersModule { }
