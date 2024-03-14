import { IsEnum, IsOptional, IsString } from "class-validator";
import { ShowCategory } from "../types/show-category.type";

export class FindAllShowDto {
    @IsOptional()
    @IsString()
    keyword?: string;

    @IsOptional()
    @IsEnum(ShowCategory)
    category?: ShowCategory;
}