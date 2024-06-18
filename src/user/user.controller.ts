import { UserInfo } from 'src/utils/userInfo.decorator';

import { Body, Controller, Get, HttpStatus, Post, UseGuards } from '@nestjs/common';
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
        const user = await this.userService.register(registerDto);
        return {
            statusCode: HttpStatus.OK,
            message: `회원가입에 성공했습니다.`,
            user,
        }
    }

    //로그인
    @Post('login')
    async login(@Body() loginDto: LoginDto) {
        const token = await this.userService.login(loginDto);
        return {
            statusCode: HttpStatus.OK,
            message: `로그인에 성공했습니다.`,
            token,
        }
    }

    //프로필 조회(닉네임, 포인트, 예약 내역)
    @UseGuards(AuthGuard('jwt'))
    @Get('profile')
    async profile(@UserInfo() user: User) {
        const profile = await this.userService.profile(user.userId)
        return {
            statusCode: HttpStatus.OK,
            message: `내 프로필 조회에 성공했습니다.`,
            nickname: user.nickname,
            point: user.point,
            reservation: profile,
        };
    }
}