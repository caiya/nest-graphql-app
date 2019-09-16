import { ArticleInput } from "../../graphql";
import { Length, IsNumber } from "class-validator";

export class CreateArticleDto implements ArticleInput{

    @Length(5, 50)
    title: string;

    @Length(5, 20000)
    content: string;

    @IsNumber()
    userId: number;
}