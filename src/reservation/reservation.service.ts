import _ from 'lodash';
import { Repository } from 'typeorm';

import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Reservation } from './entities/reservation.entity';
import { User } from 'src/user/entities/user.entity';
import { Seat } from 'src/show/entities/seat.entity';
import { Show } from 'src/show/entities/show.entity';
import { ReservationDto } from './dto/reservation.dto';
import { seatStatus } from 'src/show/types/seatStatus.type';

@Injectable()
export class ReservationService {
    constructor(
        @InjectRepository(Reservation) private readonly reservationRepository: Repository<Reservation>,
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        @InjectRepository(Seat) private readonly seatRepository: Repository<Seat>,
        @InjectRepository(Show) private readonly showRepository: Repository<Show>,
    ) { }

    //예매하기
    async reserve(userId: number, reservationDto: ReservationDto) {
        const user = await this.userRepository.findOneBy({ userId });
        const show = await this.showRepository.findOne({ where: { showId: reservationDto.showId } })
        const seat = await this.seatRepository.findOne({
            where: {
                grade: reservationDto.grade,
                seatNum: reservationDto.seatNum
            }
        })

        //예매 오픈 시간인지 확인
        const localTime = new Date().getTime() + 1000 * 60 * 60 * 9;
        const reservationStartTime = new Date(show.reservationStart).getTime();
        const reservationEndTime = new Date(show.reservationEnd).getTime();

        if (localTime < reservationStartTime) {
            throw new ForbiddenException('예매 오픈을 기다려주세요.');
        }

        if (localTime > reservationEndTime) {
            throw new ForbiddenException('예매 오픈 기간이 지났습니다.');
        }

        // if (seat > 5) {
        //     throw new BadRequestException('1인당 5자리까지 예약할 수 있습니다.');
        // }

        if (!show) {
            throw new NotFoundException('공연 정보가 없습니다.');
        }

        if (user.point < seat.price) {
            throw new BadRequestException('보유한 포인트가 부족합니다.')
        }

        //해당 좌석이 이미 예매된 좌석인지 확인
        if (seat.seatStatus === seatStatus.full) {
            console.log("seat.seatStatus : ", seat.seatStatus);
            throw new BadRequestException('이미 예매된 좌석입니다.');
        }

        //예매 내역 생성
        const book = await this.reservationRepository.save({
            userId,
            seatId: seat.seatId,
            showId: show.showId
        });

        //포인트 차감
        const pUser = await this.userRepository.findOneBy({ userId });
        pUser.point = pUser.point - seat.price;
        await this.userRepository.save({
            where: { userId },
            point: pUser.point
        });

        //좌석 예매 상태 바꾸기
        await this.seatRepository.save({
            where: { seatId: seat.seatId },
            seatStatus: seatStatus.full
        })

        return book;
    }


    //예매 확인하기
    async getReservation(userId: number) {
        const reservation = await this.reservationRepository.find({
            order: { createdAt: 'ASC' },
            where: { userId },
        })

        return reservation;
    }

    //예매 취소하기(포인트 환불)
    async deleteReservation(reservationId: number, userId: number) {
        const reservation = await this.reservationRepository.findOneBy({ reservationId });
        const user = await this.userRepository.findOneBy({ userId });
        const seat = await this.seatRepository.findOneBy({ seatId: reservation.seatId });

        if (_.isNil(reservation)) {
            throw new NotFoundException('해당 예매 내역이 없습니다.')
        }

        //본인이 예매한 공연이 아닐 때
        if (reservation.userId !== userId) {
            throw new NotFoundException('예매을 취소할 권한이 없습니다.');
        }

        //예약 취소하기(좌석도 빈 자리로 변경)
        await this.reservationRepository.delete({ reservationId });
        await this.seatRepository.save({
            where: { seatId: reservation.seatId },
            seatStatus: seatStatus.empty
        })

        //포인트 환불
        await this.userRepository.save({ userId, point: user.point + seat.price })

        return reservation;
    }
}