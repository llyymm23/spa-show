import { IsDateString, IsEnum, IsMilitaryTime, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ShowCategory } from '../types/show-category.type';

export class CreateShowDto {
    @IsString()
    @IsNotEmpty({ message: '공연의 제목을 입력해주세요.' })
    title: string;

    @IsString()
    @IsNotEmpty({ message: '공연의 설명을 입력해주세요.' })
    info: string;

    @IsEnum(ShowCategory)
    @IsNotEmpty({ message: '공연의 카테고리를 입력해주세요.' })
    category: ShowCategory;

    @IsString()
    @IsNotEmpty({ message: '공연의 주소를 입력해주세요.' })
    address: string;

    @IsNumber()
    @IsNotEmpty({ message: '공연의 가격을 입력해주세요.' })
    price: number;

    @IsString()
    @IsNotEmpty({ message: '공연의 이미지를 입력해 주세요.' })
    image: string;

    @IsDateString()
    @IsNotEmpty({ message: '공연 날짜를 입력해주세요.' })
    date: Date;

    @IsMilitaryTime()
    @IsNotEmpty({ message: '공연 시간을 입력해 주세요.' })
    time: string;

    @IsNumber()
    @IsNotEmpty({ message: '공연의 좌석수를 입력해주세요.' })
    total_seat: number;
}