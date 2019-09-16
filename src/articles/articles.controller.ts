import { Controller, Get, Request, Post, UseGuards } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { RequirePermits } from '../permits/auth.decorator';
import { RequirePermitsGuard } from '../permits/auth.guard';
import { ApiUseTags, ApiBearerAuth, ApiModelProperty } from '@nestjs/swagger';
import { GqlJwtAuthGuard } from '../auth/gql-jwt.guard';

@Controller('articles')
@ApiBearerAuth()
@ApiUseTags('文章模块')
export class ArticlesController {

    constructor(private readonly authService: AuthService) { }

    @RequirePermits('article:create')
    @UseGuards(GqlJwtAuthGuard, RequirePermitsGuard)
    @Post()
    @ApiModelProperty({description: '新增文章'})
    async createArticle(@Request() req) {
        return this.authService.login(req.user);
    }

    @RequirePermits('article:list')
    @UseGuards(GqlJwtAuthGuard, RequirePermitsGuard)
    @Get()
    @ApiModelProperty({description: '文章列表'})
    getArticles(@Request() req) {
        return req.user;
    }

    @RequirePermits('article:del')
    @UseGuards(GqlJwtAuthGuard, RequirePermitsGuard)
    @Post()
    @ApiModelProperty({description: '文章删除'})
    delArticles(@Request() req) {
        return req.user;
    }
}
