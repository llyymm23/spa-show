import { IsArray, IsDateString, IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ShowCategory } from '../types/show-category.type';
import { Grade } from '../types/seat.type';

export class CreateShowDto {
    @IsString()
    @IsNotEmpty({ message: '공연의 제목을 입력해주세요.' })
    title: string;

    @IsString()
    @IsNotEmpty({ message: '공연의 설명을 입력해주세요.' })
    info: string;

    @IsString()
    // @ApiProperty({
    //     example: '2024-06-18T20:00:00',
    //     description: '예매 시작',
    // })
    @IsNotEmpty({ message: '예매 시작 날짜를 입력해주세요.' })
    reservationStart: string;

    @IsString()
    // @ApiProperty({
    //     example: '2024-06-18T20:00:00',
    //     description: '예매 마감',
    // })
    @IsNotEmpty({ message: '예매 마감 날짜를 입력해주세요.' })
    reservationEnd: string;

    @IsDateString()
    @IsNotEmpty({ message: '공연 날짜와 시간을 입력해주세요.' })
    // @ApiProperty({
    //     example: '2024-06-18T19:00:00',
    //     description: '공연 날짜와 시간 (ISO 8601 형식)',
    // })
    date: Date;

    @IsEnum(ShowCategory)
    @IsNotEmpty({ message: '공연의 카테고리를 입력해주세요.' })
    category: ShowCategory;

    @IsString()
    @IsNotEmpty({ message: '공연의 주소를 입력해주세요.' })
    address: string;

    @IsArray()
    @IsString({ each: true })
    @IsNotEmpty({ message: '좌석 등급을 기입해주세요.' })
    grade: Grade[];

    @IsArray()
    @IsNumber({}, { each: true })
    // @ApiProperty({
    //     example: [20000, 100000],
    //     description: '좌석 등급별 가격',
    //     type: 'array',
    // })
    @IsNotEmpty({ message: '등급별 가격을 입력해주세요.' })
    price: number[];

    @IsArray()
    @IsNumber({}, { each: true })
    // @ApiProperty({
    //     example: [10, 20],
    //     description: '등급별 좌석 수',
    //     type: 'array',
    // })
    @IsNotEmpty({ message: '등급별 좌석수를 입력해주세요.' })
    seat: number[];
}
