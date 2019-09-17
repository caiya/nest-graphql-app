import { Controller, Get, Request, Post, UseGuards, UseInterceptors, UploadedFile, Param, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../auth/auth.service';
import { RequirePermits } from '../permits/auth.decorator';
import { RequirePermitsGuard } from '../permits/auth.guard';
import { ApiBearerAuth, ApiOperation, ApiUseTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { OssService } from '../oss/oss.service';
import { writeFileSync } from 'fs';

@Controller('users')
@ApiBearerAuth()
@ApiUseTags('用户模块')
export class UsersController {

    constructor(private readonly authService: AuthService, private readonly ossService: OssService) { }

    @UseGuards(AuthGuard('local'))
    @Post('login')
    @ApiOperation({ title: '用户登录' })
    async login(@Request() req) {
        return this.authService.login(req.user);
    }

    @RequirePermits('users:profile')
    @UseGuards(AuthGuard('jwt'), RequirePermitsGuard)
    @Get('profile')
    @ApiOperation({ title: '当前登录用户信息' })
    getProfile(@Request() req) {
        return req.user;
    }

    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(@UploadedFile() file) {
        console.log(file);
        // const buckets = await this.ossService.listBuckets()
        writeFileSync
        const results = await this.ossService.uploadFile(file)
        // 入库+水印
        console.log('results:', results)
        return results
    }

    @Get('file')
    async getUploadUrl(@Query('name') name: string) {
        console.log(name)
        const fileUrl = await this.ossService.getUploadFileUrl(name)
        return {
            url: fileUrl
        }
    }

    @Get('upload')
    async listUploads() {
        const results = await this.ossService.listUploadFiles()
        return results
    }

}
