import { User } from 'src/user/entities/user.entity';

import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { UserInfo } from '../utils/userInfo.decorator';
import { ReservationDto } from './dto/reservation.dto';
import { ReservationService } from './reservation.service';

@UseGuards(AuthGuard('jwt'))
@Controller('reservation')
export class ReservationController {
    constructor(
        private readonly reservationService: ReservationService
    ) { }

    //공연 예매하기
    @Post()
    async reserve(@UserInfo() user: User, @Body() reservationDto: ReservationDto) {
        const show = await this.reservationService.reserve(user.userId, reservationDto);
        return {
            statusCode: HttpStatus.OK,
            message: `공연 예매에 성공하였습니다.`,
            show,
        }
    }

    //예매 확인하기
    @Get()
    async getReservation(@UserInfo() user: User) {
        const reservation = await this.reservationService.getReservation(user.userId);
        return {
            statusCode: HttpStatus.OK,
            message: `공연 예매 확인에 성공하였습니다.`,
            reservation,
        }
    }

    //예매 취소하기
    @Delete(':reservationId')
    async deleteReservation(@UserInfo() user: User, @Param('reservationId') reservationId: number) {
        const reservation = await this.reservationService.deleteReservation(reservationId, user.userId)
        return {
            statusCode: HttpStatus.OK,
            message: `예매를 취소하였습니다.`,
            reservation,
        }
    }
}