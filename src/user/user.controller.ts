import { UserInfo } from 'src/utils/userInfo.decorator';

import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) { }

    //회원가입
    @Post('register')
    async register(@Body() registerDto: RegisterDto) {
        return await this.userService.register(registerDto.role, registerDto.nickname, registerDto.email, registerDto.password, registerDto.passwordconfirm);
    }

    //로그인
    @Post('login')
    async login(@Body() loginDto: LoginDto) {
        return await this.userService.login(loginDto.email, loginDto.password);
    }

    //프로필 조회
    @UseGuards(AuthGuard('jwt'))
    @Get('profile')
    getEmail(@UserInfo() user: User) {
        return {
            nickname: user.nickname,
            point: user.point
        };
    }
}