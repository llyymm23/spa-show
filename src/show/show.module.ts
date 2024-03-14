import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Show } from './entities/show.entity';
import { ShowController } from './show.controller';
import { ShowService } from './show.service';
import { Seat } from './entities/seat.entity';
import { Schedule } from './entities/schedule.entity';
import { Reservation } from 'src/reservation/entities/reservation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Show, Schedule, Seat, Reservation])],
  providers: [ShowService],
  controllers: [ShowController],
})
export class ShowModule { }