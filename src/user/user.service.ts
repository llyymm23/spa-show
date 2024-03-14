import { compare, hash } from 'bcrypt';
import _ from 'lodash';
import { Repository } from 'typeorm';

import { BadRequestException, ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from './entities/user.entity';
import { Role } from './types/userRole.type';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private readonly jwtService: JwtService,
    ) { }

    async register(role: Role, nickname: string, email: string, password: string, passwordconfirm: string) {
        const existingUser = await this.findByEmail(email);

        if (password !== passwordconfirm) {
            throw new BadRequestException('비밀번호가 일치하지 않습니다.')
        }

        if (existingUser) {
            throw new ConflictException(
                '이미 해당 이메일로 가입된 사용자가 있습니다!',
            );
        }

        const hashedPassword = await hash(password, 10);
        await this.userRepository.save({
            role,
            nickname,
            email,
            password: hashedPassword,
            point: 1000000
        });
    }

    async login(email: string, password: string) {
        const user = await this.userRepository.findOne({
            select: ['userId', 'email', 'password'],
            where: { email },
        });
        if (_.isNil(user)) {
            throw new UnauthorizedException('이메일을 확인해주세요.');
        }

        if (!(await compare(password, user.password))) {
            throw new UnauthorizedException('비밀번호를 확인해주세요.');
        }

        const payload = { email, sub: user.userId };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }

    async findByEmail(email: string) {
        return await this.userRepository.findOneBy({ email });
    }

    async findById(userId: number) {
        return await this.userRepository.findOneBy({ userId });
    }
}