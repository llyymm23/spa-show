import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateShowDto {
    @IsString()
    @IsNotEmpty({ message: '공연의 제목을 입력해주세요.' })
    readonly title: string;

    @IsString()
    @IsNotEmpty({ message: '공연의 설명을 입력해주세요.' })
    readonly info: string;

    @IsString()
    @IsNotEmpty({ message: '공연의 날짜를 입력해주세요.' })
    readonly date: string;

    @IsString()
    @IsNotEmpty({ message: '공연의 장소를 입력해주세요.' })
    readonly address: string;

    @IsNumber()
    @IsNotEmpty({ message: '공연의 좌석수를 입력해주세요.' })
    readonly total_seat: number;

    //이미지
    // @IsString()({ message: '공연의 사진을 입력해주세요.' })
    // readonly image: string;

    @IsString()
    @IsNotEmpty({ message: '공연의 카테고리를 입력해주세요.' })
    readonly category: string;

    @IsNumber()
    @IsNotEmpty({ message: '공연의 가격을 입력해주세요.' })
    readonly price: number;
}