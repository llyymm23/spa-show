import { IsNotEmpty, IsNumber } from 'class-validator';

export class ReservationDto {
    @IsNumber()
    @IsNotEmpty({ message: '예약하려는 공연의 id값을 입력해주세요.' })
    scheduleId: number;

    @IsNumber()
    @IsNotEmpty({ message: '예약하고자 하는 좌석수를 입력해주세요.' })
    seat: number;
}