import { IsEnum, IsOptional, IsString } from "class-validator";
import { ShowCategory } from "../types/show-category.type";

export class FindShowDto {
    //키워드 검색 = 공연 이름 검색
    @IsOptional()
    @IsString()
    keyword?: string;

    @IsOptional()
    @IsEnum(ShowCategory)
    category?: ShowCategory;
}