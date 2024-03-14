// import { IsNotEmpty, IsString } from 'class-validator';

// export class UpdateShowDto {
//     @IsString()
//     @IsNotEmpty({ message: '팀 이름을 입력해주세요.' })
//     name: string;

//     @IsString()
//     @IsNotEmpty({ message: '팀에 대한 소개를 입력해주세요.' })
//     description: string;
// }


/////////////

import { OmitType } from '@nestjs/mapped-types';

import { CreateShowDto } from './create-show.dto';

export class UpdateShowDto extends OmitType(CreateShowDto, ['title']) { }