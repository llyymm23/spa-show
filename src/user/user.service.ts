import { compare, hash } from 'bcrypt';
import _ from 'lodash';
import { Repository } from 'typeorm';

import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from './entities/user.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private readonly jwtService: JwtService,
    ) { }

    async register(nickname: string, email: string, password: string) {
        const existingUser = await this.findByEmail(email);
        if (existingUser) {
            throw new ConflictException(
                '이미 해당 이메일로 가입된 사용자가 있습니다!',
            );
        }

        const hashedPassword = await hash(password, 10);
        await this.userRepository.save({
            nickname,
            email,
            password: hashedPassword,
            point: 1000000
        });
    }

    async login(email: string, password: string) {
        const user = await this.userRepository.findOne({
            select: ['id', 'email', 'password'],
            where: { email },
        });
        if (_.isNil(user)) {
            throw new UnauthorizedException('이메일을 확인해주세요.');
        }

        if (!(await compare(password, user.password))) {
            throw new UnauthorizedException('비밀번호를 확인해주세요.');
        }

        const payload = { email, sub: user.id };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }

    async findByEmail(email: string) {
        return await this.userRepository.findOneBy({ email });
    }

    async findById(id: number) {
        return await this.userRepository.findOneBy({ id });
    }

    //예약 후 포인트 차감
    async updateReservation(id: number, price: number) {
        const user = await this.userRepository.findOneBy({ id });
        const updatedPoint = user.point - price;

        await this.userRepository.update({ id }, { point: updatedPoint });
    }

    //예약 취소 후 포인트 환불
    async deletePoint(id: number, price: number) {
        const user = await this.userRepository.findOneBy({ id });
        const point = user.point + price;

        await this.userRepository.update({ id }, { point });
    }
}