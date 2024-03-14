import _ from 'lodash';
import { Repository } from 'typeorm';

import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { ShowService } from 'src/show/show.service';
import { UserService } from 'src/user/user.service';
import { Reservation } from './entities/reservation.entity';

@Injectable()
export class ReservationService {
    constructor(
        @InjectRepository(Reservation)
        private reservationRepository: Repository<Reservation>,
        private readonly showService: ShowService,
        private readonly userService: UserService,
    ) { }

    //예약 확인하기
    async getReservation(reservationId: number) {
        return await this.reservationRepository.find({
            order: { createdAt: 'ASC' },
            where: { reservationId },
        })
    }

    //예약하기
    async reserve(id: number, showId: number, seat: number) {
        const user = await this.userService.findById(id);
        const show = await this.showService.findOne(showId);
        const reservation = await this.reservationRepository.find({ where: { showId } });

        if (show.total_seat < show.current_seat) {
            throw new BadRequestException('남은 좌석이 없습니다.');
        }

        if (user.point < show.price) {
            throw new BadRequestException('보유한 포인트가 부족합니다.')
        }

        if (!reservation) {
            throw new NotFoundException('해당 공연이 없습니다.');
        }
        await this.reservationRepository.save({ id, showId, seat });
        this.showService.updateReservation(showId, seat);
        this.userService.updateReservation(id, show.price);
    }

    // //예약 수정하기
    // async updateReservation(id: number, userId: number, message: string) {
    //     await this.verifyMessage(id, userId);
    //     await this.reservationRepository.update({ id }, { message });
    // }

    //예약 취소하기(포인트 환불)
    async deleteReservation(reservationId: number, id: number) {
        await this.verifyMessage(reservationId, id);
        await this.reservationRepository.delete({ reservationId });
    }

    private async verifyMessage(reservationId: number, id: number) {
        const reservation = await this.reservationRepository.findOneBy({
            reservationId,
        });

        const show = await this.showService.findOne(reservation.showId);

        if (_.isNil(reservation) || reservation.reservationId !== id) {
            throw new NotFoundException(
                '메시지를 찾을 수 없거나 삭제할 권한이 없습니다.',
            );
        }

        await this.userService.deletePoint(id, show.price);
    }
}