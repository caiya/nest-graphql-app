
/** ------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
export interface ArticleInput {
    title: string;
    content: string;
    userId: number;
}

export interface UserInput {
    username: string;
    password: string;
    age: number;
    birth: string;
    permis?: string;
}

export interface UserLogin {
    username: string;
    password: string;
}

export interface Article {
    id?: number;
    title?: string;
    content?: string;
    user?: User;
}

export interface IMutation {
    createArticle(article: ArticleInput): Article | Promise<Article>;
    createUser(user: UserInput): User | Promise<User>;
    updateUser(id: string, user: UserInput): boolean | Promise<boolean>;
    delUser(id: string): boolean | Promise<boolean>;
    login(user: UserLogin): Token | Promise<Token>;
}

export interface IQuery {
    articles(): Article[] | Promise<Article[]>;
    article(id: string): Article | Promise<Article>;
    users(): User[] | Promise<User[]>;
    user(id: string): User | Promise<User>;
    getArticlesByUserId(id: string): Article[] | Promise<Article[]>;
}

export interface Token {
    accessToken?: string;
}

export interface User {
    id?: number;
    username?: string;
    password?: string;
    age?: number;
    birth?: string;
    permis?: string;
    articles?: Article[];
}
