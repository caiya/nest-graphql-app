import { BaseRepository } from "typeorm-transactional-cls-hooked";
import { EntityRepository } from "typeorm";
import { Article } from "../entity/articles.entity";

@EntityRepository(Article)
export class ArticleRespository extends BaseRepository<Article> {

}