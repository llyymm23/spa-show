import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Reservation } from './entities/reservation.entity';
import { ReservationController } from './reservation.controller';
import { ReservationService } from './reservation.service';

import { UserModule } from 'src/user/user.module';
import { ShowModule } from 'src/show/show.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Reservation]),
    UserModule,
    ShowModule
  ],
  providers: [ReservationService],
  controllers: [ReservationController],
})
export class ReservationModule { }