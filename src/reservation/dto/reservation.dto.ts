import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ReservationDto {
    @IsNumber()
    @IsNotEmpty({ message: '예약하려는 공연의 id값을 입력해주세요.' })
    scheduleId: number;

    @IsString()
    @IsNotEmpty({ message: '예약하고자 하는 좌석의 등급을 입력해주세요.' })
    grade: string;

    @IsNumber()
    @IsNotEmpty({ message: '예약하고자 하는 좌석 번호를 입력해주세요.' })
    seat_num: number;
}