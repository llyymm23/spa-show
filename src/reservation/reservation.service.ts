import _ from 'lodash';
import { Repository } from 'typeorm';

import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Reservation } from './entities/reservation.entity';
import { User } from 'src/user/entities/user.entity';
import { Seat } from 'src/show/entities/seat.entity';
import { Schedule } from 'src/show/entities/schedule.entity';
import { Show } from 'src/show/entities/show.entity';

@Injectable()
export class ReservationService {
    constructor(
        @InjectRepository(Reservation) private readonly reservationRepository: Repository<Reservation>,
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        @InjectRepository(Seat) private readonly seatRepository: Repository<Seat>,
        @InjectRepository(Schedule) private readonly scheduleRepository: Repository<Schedule>,
        @InjectRepository(Show) private readonly showRepository: Repository<Show>,
    ) { }

    //예약 확인하기
    async getReservation(userId: number) {
        return await this.reservationRepository.find({
            order: { createdAt: 'ASC' },
            where: { userId },
        })
    }

    //예약하기
    async reserve(userId: number, scheduleId: number, seat: number) {
        const user = await this.userRepository.findOneBy({ userId });
        const schedule = await this.scheduleRepository.findOne({
            where: { scheduleId },
        });
        const seats = await this.seatRepository.findOneBy({ scheduleId });

        const show = await this.showRepository.findOneBy({ showId: schedule.showId });

        const price = show.price * seat;

        if (seat > 5) {
            throw new BadRequestException('1인당 5자리까지 예약할 수 있습니다.');
        }

        if (!schedule) {
            throw new NotFoundException('공연 정보가 없습니다.');
        }

        if (user.point < price) {
            throw new BadRequestException('보유한 포인트가 부족합니다.')
        }

        if (seats.current_seat < seat) {
            throw new BadRequestException('남은 좌석이 부족하거나 없습니다.');
        }

        //예매 내역 생성
        const book = await this.reservationRepository.save({ userId, scheduleId });

        console.log(book);

        //포인트 차감
        const pUser = await this.userRepository.findOneBy({ userId });
        pUser.point = pUser.point - price;
        await this.userRepository.save(pUser);

        //좌석 개수 줄이기
        const rSeat = await this.seatRepository.findOneBy({ scheduleId });
        rSeat.current_seat -= seat;
        await this.seatRepository.save(rSeat);

        return book;
    }

    // //예약 수정하기
    // async updateReservation(id: number, userId: number, message: string) {
    //     await this.verifyMessage(id, userId);
    //     await this.reservationRepository.update({ id }, { message });
    // }

    //예약 취소하기(포인트 환불)
    async deleteReservation(reservationId: number, userId: number) {
        const reservation = await this.reservationRepository.findOneBy({ reservationId });

        const scheduleId = reservation.scheduleId;

        const schedule = await this.scheduleRepository.findOneBy({ scheduleId });


        const showId = schedule.showId;

        console.log("showId");
        console.log(showId);

        const show = await this.showRepository.findOneBy({ showId });

        const user = await this.userRepository.findOneBy({ userId });

        console.log(show);
        console.log(user);

        if (_.isNil(reservation)) {
            throw new NotFoundException('해당 예약 내역이 없습니다.')
        }

        if (user.userId !== userId) {
            throw new NotFoundException('예약을 취소할 권한이 없습니다.');
        }

        //예약 취소하기
        await this.reservationRepository.delete({ reservationId });
        //포인트 환불
        await this.userRepository.save({ userId, point: user.point + show.price })

        return show;
    }
}