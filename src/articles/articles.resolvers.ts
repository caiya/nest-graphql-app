import { Resolver, Query, Args, Mutation, ResolveProperty } from "@nestjs/graphql";
import { Inject, ParseIntPipe } from "@nestjs/common";
import { ArticlesService } from "./articles.service";
import { Article } from "./entity/articles.entity";
import { CreateArticleDto } from "./dto/create-article.dto";
import { UsersService } from "../users/users.service";

@Resolver('Article')
export class ArticleResolver {

    @Inject()
    private readonly articleService: ArticlesService;

    @Inject()
    private readonly usersService: UsersService;

    @Query('articles')
    async getArticles() : Promise<Article[]> {
        return this.articleService.findAll()
    }

    @Query('article')
    async getArticleDetail(@Args('id', ParseIntPipe) id: number): Promise<Article> {
        return await this.articleService.findOneById(id)
    }

    @Mutation()
    async createArticle(@Args('article') article: CreateArticleDto): Promise<Article> {
        return await this.articleService.create(article)
    }

    @ResolveProperty('user')
    async findUser(article) {
        return await this.usersService.findOneById(article.userId);
    }
}