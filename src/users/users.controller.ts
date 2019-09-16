import { Controller, Get, Request, Post, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../auth/auth.service';
import { RequirePermits } from '../permits/auth.decorator';
import { RequirePermitsGuard } from '../permits/auth.guard';
import { ApiBearerAuth, ApiOperation, ApiUseTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('users')
@ApiBearerAuth()
@ApiUseTags('用户模块')
export class UsersController {

    constructor(private readonly authService: AuthService) { }

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
    uploadFile(@UploadedFile() file) {
        console.log(file);
    }
}
