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

    //공연 예약하기
    @Post()
    async reserve(@UserInfo() user: User, @Body() reservationDto: ReservationDto) {
        const show = await this.reservationService.reserve(user.userId, reservationDto);
        return {
            statusCode: HttpStatus.OK,
            message: `공연 예약에 성공하였습니다.`,
            show,
        }
    }

    //예약 확인하기
    @Get()
    async getReservation(
        @UserInfo() user: User,
    ) {
        return await this.reservationService.getReservation(user.userId);
    }

    // //예약 수정하기
    // @Patch(':id')
    // async updateReservation(
    //     @UserInfo() user: User,
    //     @Param('id') id: number,
    //     @Body() reservationDto: ReservationDto,
    // ) {
    //     await this.reservationService.updateReservation(
    //         id,
    //         user.id,
    //         reservationDto.message,
    //     );
    // }

    //예약 취소하기
    @Delete(':reservationId')
    async deleteReservation(@UserInfo() user: User, @Param('reservationId') reservationId: number) {
        await this.reservationService.deleteReservation(reservationId, user.userId)
    }
}