import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Grade } from 'src/show/types/seat.type';

export class ReservationDto {
    @IsNumber()
    @IsNotEmpty({ message: '예약하려는 공연의 id값을 입력해주세요.' })
    showId: number;

    @IsString()
    @IsNotEmpty({ message: '예약하고자 하는 좌석의 등급을 입력해주세요.' })
    grade: Grade;

    @IsNumber()
    @IsNotEmpty({ message: '예약하고자 하는 좌석 번호를 입력해주세요.' })
    seatNum: number;
}