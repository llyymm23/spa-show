import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Reservation } from './entities/reservation.entity';
import { ReservationController } from './reservation.controller';
import { ReservationService } from './reservation.service';

import { User } from 'src/user/entities/user.entity';
import { Seat } from 'src/show/entities/seat.entity';
import { Show } from 'src/show/entities/show.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Reservation, User, Seat, Show]),
  ],
  providers: [ReservationService],
  controllers: [ReservationController],
})
export class ReservationModule { }