import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { Role } from 'src/user/types/userRole.type';

import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Query, UseGuards } from '@nestjs/common';

import { CreateShowDto } from './dto/create-show.dto';
import { ShowService } from './show.service';
import { AuthGuard } from '@nestjs/passport';
import { FindShowDto } from './dto/find-show.dto';
import { UpdateShowDto } from './dto/update-show.dto';

@UseGuards(AuthGuard('jwt'))
@UseGuards(RolesGuard)
@Controller('show')
export class ShowController {
    constructor(
        private readonly showService: ShowService
    ) { }

    //새 공연 등록
    //Admin만 가능
    @Roles(Role.Admin)
    @Post()
    async create(@Body() createshowDto: CreateShowDto) {
        const show = await this.showService.create(createshowDto);
        return {
            statusCode: HttpStatus.OK,
            message: `새 공연을 등록했습니다.`,
            show,
        }
    }

    //공연 검색하기(목록-키워드,카테고리/이름 검색)
    @Get()
    async findShow(@Query() findShowDto: FindShowDto) {
        const shows = await this.showService.findShow(findShowDto);
        return {
            statusCode: HttpStatus.OK,
            message: `공연 검색에 성공하였습니다.`,
            shows,
        }
    }

    //공연 상세 보기
    @Get(':showId')
    async findOne(@Param('showId') showId: number) {
        const show = await this.showService.findOne(showId);
        return {
            statusCode: HttpStatus.OK,
            message: `공연 상세 정보를 조회하였습니다.`,
            show,
        }
    }

    //공연 내용 수정
    //Admin만 가능
    @Roles(Role.Admin)
    @Put(':showId')
    async updateShow(@Param('showId') showId: number, @Body() updateshowDto: UpdateShowDto) {
        const show = await this.showService.updateShow(showId, updateshowDto);
        return {
            statusCode: HttpStatus.OK,
            message: `공연 내용 수정에 성공하였습니다.`,
            show,
        }
    }

    //공연 삭제
    //Admin만 가능
    @Roles(Role.Admin)
    @Delete(':showId')
    async deleteShow(@Param('showId') showId: number) {
        const show = await this.showService.deleteShow(showId);
        return {
            statusCode: HttpStatus.OK,
            message: `공연 삭제에 성공하였습니다.`,
            show,
        }
    }
}