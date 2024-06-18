import { compare, hash } from 'bcrypt';
import _ from 'lodash';
import { Repository } from 'typeorm';

import { BadRequestException, ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from './entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Reservation } from 'src/reservation/entities/reservation.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(Reservation) private reservationRepository: Repository<Reservation>,
        private readonly jwtService: JwtService,
    ) { }

    async register(registerDto: RegisterDto) {
        const existingUser = await this.userRepository.findOneBy({ email: registerDto.email });

        if (registerDto.password !== registerDto.passwordconfirm) {
            throw new BadRequestException('비밀번호가 일치하지 않습니다.')
        }

        if (existingUser) {
            throw new ConflictException(
                '이미 해당 이메일로 가입된 사용자가 있습니다!',
            );
        }

        const hashedPassword = await hash(registerDto.password, 10);

        const user = await this.userRepository.save({
            role: registerDto.role,
            nickname: registerDto.nickname,
            email: registerDto.email,
            password: hashedPassword,
            point: 1000000
        });

        return user;
    }

    async login(loginDto: LoginDto) {
        const user = await this.userRepository.findOne({
            select: ['userId', 'email', 'password'],
            where: { email: loginDto.email },
        });

        if (_.isNil(user)) {
            throw new UnauthorizedException('이메일을 확인해주세요.');
        }

        if (!(await compare(loginDto.password, user.password))) {
            throw new UnauthorizedException('비밀번호를 확인해주세요.');
        }

        const payload = { email: loginDto.email, sub: user.userId };

        return {
            access_token: this.jwtService.sign(payload),
        };
    }

    async profile(userId: number) {
        const reservation = await this.reservationRepository.find({ where: { userId } });

        return reservation;
    }
}