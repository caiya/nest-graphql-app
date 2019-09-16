import { Module, forwardRef } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { ArticlesController } from './articles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from './entity/articles.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Article]),
    forwardRef(() => UsersModule)
  ],
  providers: [ArticlesService],
  controllers: [ArticlesController],
  exports: [ArticlesService]
})
export class ArticlesModule {}
