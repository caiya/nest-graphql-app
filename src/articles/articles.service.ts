import { Injectable } from '@nestjs/common';
import { Article } from './entity/articles.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult, DeleteResult } from 'typeorm';
import { CreateArticleDto } from './dto/create-article.dto';

@Injectable()
export class ArticlesService {

    constructor(
        @InjectRepository(Article)
        private readonly articleRepository: Repository<Article>
    ) { }

    findOneById(uid: number): Promise<Article> {
        return this.articleRepository.findOne(uid)
    }

    create(article: CreateArticleDto): Promise<Article> {
        return this.articleRepository.save(article)
    }

    findAll(): Promise<Article[]> {
        return this.articleRepository.find();
    }

    findArticlesByUserId(id: number): Promise<Article[]> {
        return this.articleRepository.find({
            userId: id
        })
    }
}
