import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Role } from '../types/userRole.type';

export class RegisterDto {
    @IsEnum(Role)
    role?: Role;

    @IsString()
    @IsNotEmpty({ message: '닉네임을 입력해주세요.' })
    nickname: string;

    @IsEmail()
    @IsNotEmpty({ message: '이메일을 입력해주세요.' })
    email: string;

    @IsString()
    @IsNotEmpty({ message: '비밀번호를 입력해주세요.' })
    password: string;

    @IsString()
    @IsNotEmpty({ message: '비밀번호를 한 번 더 입력해주세요.' })
    passwordconfirm: string;
}