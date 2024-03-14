import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { Role } from 'src/user/types/userRole.type';

import {
    Body, Controller, Delete, Get, Param, Post, Put, Query, UploadedFile, UseGuards, UseInterceptors
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { CreateShowDto } from './dto/create-show.dto';
import { SearchShowDTO } from './dto/search-show.dto';
import { ShowService } from './show.service';
import { AuthGuard } from '@nestjs/passport';
import { FindAllShowDto } from './dto/find-all-show.dto';

@UseGuards(AuthGuard('jwt'))
@UseGuards(RolesGuard)
@Controller('show')
export class ShowController {
    constructor(private readonly showService: ShowService) { }

    //새 공연 등록
    //Admin만 가능
    @Roles(Role.Admin)
    @Post()
    async create(@Body() createshowDto: CreateShowDto) {
        await this.showService.create(createshowDto);
    }

    //공연 목록 조회
    @Get()
    async findAll(@Query() findAllShowDto: FindAllShowDto) {
        return await this.showService.findAll(findAllShowDto);
    }

    //공연 상세 보기
    @Get(':showId')
    async findOne(@Param('showId') showId: number) {
        return await this.showService.findOne(showId);
    }

    //공연 검색하기
    @Post('search')
    async search(@Body() searchshowDto: SearchShowDTO) {
        return await this.showService.search(searchshowDto);
    }

    //새 공연 등록
    // @Roles(Role.Admin)
    // @Post()
    // @UseInterceptors(FileInterceptor('file'))
    // async create(@UploadedFile() file: Express.Multer.File) {
    //     await this.showService.create(file);
    // }

    // //공연 수정
    // @Roles(Role.Admin)
    // @Put(':id')
    // async update(@Param('id') id: number, @Body() updateshowDto: UpdateShowDto) {
    //     await this.showService.update(id, updateTeamDto);
    // }

    // //공연 삭제
    // @Roles(Role.Admin)
    // @Delete(':id')
    // async delete(@Param('id') id: number) {
    //     await this.showService.delete(id);
    // }
}