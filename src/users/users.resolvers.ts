import { Resolver, Query, Mutation, Args, ResolveProperty } from "@nestjs/graphql";
import { UsersService } from "./users.service";
import { Inject, ParseIntPipe, UseGuards, Post, UnauthorizedException } from "@nestjs/common";
import { ArticlesService } from "../articles/articles.service";
import { User } from "./entity/users.entity";
import { Article } from "../articles/entity/articles.entity";
import { CreateUserDto } from "./dto/create-user.dto";
import { RequirePermits } from "../permits/auth.decorator";
import { RequirePermitsGuard } from "../permits/auth.guard";
import { GqlJwtAuthGuard } from "../auth/gql-jwt.guard";
import { ApiBearerAuth, ApiUseTags, ApiOperation } from "@nestjs/swagger";
import { UserLoginDto } from "./dto/user-login.dto";

@Resolver('User')
@ApiBearerAuth()
@ApiUseTags('用户模块')
export class UsersResolvers {

    @Inject()
    private readonly userService: UsersService;

    @Inject()
    private readonly articleService: ArticlesService;

    @RequirePermits('users:list')
    @UseGuards(GqlJwtAuthGuard, RequirePermitsGuard)
    @Query('users')
    @ApiOperation({ title: '用户列表' })
    async getUsers(): Promise<User[]> {
        return this.userService.findAll()
    }

    @RequirePermits('users:detail')
    @UseGuards(GqlJwtAuthGuard, RequirePermitsGuard)
    @Query('user')
    @ApiOperation({ title: '用户详情' })
    async getUserDetail(@Args('id', ParseIntPipe) id: number): Promise<User> {
        return await this.userService.findOneById(id)
    }

    @RequirePermits('users:userArticles')
    @UseGuards(GqlJwtAuthGuard, RequirePermitsGuard)
    @Query()
    @ApiOperation({ title: '查询指定用户所有文章' })
    async getArticlesByUserId(@Args('id', ParseIntPipe) id: number): Promise<Article[]> {
        return await this.articleService.findArticlesByUserId(id);
    }

    @ResolveProperty('articles')
    async getArticles(user): Promise<Article[]> {
        return await this.articleService.findArticlesByUserId(user.id);
    }

    @RequirePermits('users:create')
    @UseGuards(GqlJwtAuthGuard, RequirePermitsGuard)
    @Mutation()
    @ApiOperation({ title: '新增用户' })
    async createUser(@Args('user') user: CreateUserDto): Promise<User> {
        return await this.userService.create({
            ...user
        })
    }

    @RequirePermits('users:update')
    @UseGuards(GqlJwtAuthGuard, RequirePermitsGuard)
    @Mutation()
    @ApiOperation({ title: '用户更新' })
    async updateUser(@Args('id', ParseIntPipe) id: number, @Args('user') user: User): Promise<boolean> {
        return await this.userService.updateOneById(id, user)
    }

    @RequirePermits('users:del')
    @UseGuards(GqlJwtAuthGuard, RequirePermitsGuard)
    @Mutation()
    @ApiOperation({ title: '用户删除' })
    async delUser(@Args('id', ParseIntPipe) id: number): Promise<boolean> {
        return await this.userService.delOneById(id)
    }

    @Mutation()
    @ApiOperation({ title: '用户登录' })
    async login(@Args('user') user: UserLoginDto): Promise<any> {
        const userInfo = await this.userService.validateUserAndPass(user.username, user.password)
        if (!userInfo) {
            throw new UnauthorizedException('用户名或密码错误')
        }
        return this.userService.signToken(userInfo)
    }
}