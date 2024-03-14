import _ from 'lodash';
import { parse } from 'papaparse';
import { Repository } from 'typeorm';

import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

//import { UpdateShowDto } from './dto/update-show.dto';
import { Show } from './entities/show.entity';
import { SearchShowDTO } from './dto/search-show.dto';
import { CreateShowDto } from './dto/create-show.dto';

@Injectable()
export class ShowService {
    constructor(
        @InjectRepository(Show)
        private readonly showRepository: Repository<Show>,
    ) { }

    //공연 목록 보기
    // - 공연의 리스트를 조회합니다.
    // - 전체, 공연명별로 나뉘어서 조회 가능합니다. 
    async findAll(): Promise<Show[]> {
        return await this.showRepository.find({
            select: ['showId', 'title', 'info'],
        });
    }

    //공연 상세 보기
    // - 해당 공연의 정보를 반환합니다.
    // - 현재 예매가 가능한지 여부를 반환합니다.
    async findOne(showId: number) {
        const show = await this.showRepository.findOneBy({ showId });

        if (_.isNil(show)) {
            throw new NotFoundException('존재하지 않는 공연입니다.');
        }

        return show;
    }

    //새 공연 등록하기
    async create(createshowDto: CreateShowDto) {
        if (createshowDto.price > 50000) {
            throw new BadRequestException('가격은 5만 포인트를 넘을 수 없습니다.');
        }

        return await this.showRepository.save(createshowDto);
    }

    //공연 검색하기
    async search(searchshowDto: SearchShowDTO) {
        const { title } = searchshowDto;

        const show = await this.showRepository.find({ where: { title } });

        if (!show) { throw new NotFoundException('해당하는 공연이 없습니다.') };

        return show;
    }

    // //공연 수정하기
    // async update(id: number, updateTeamDto: UpdateTeamDto) {
    //     await this.verifyTeamById(id);
    //     await this.teamRepository.update({ id }, updateTeamDto);
    // }

    // //공연 삭제하기
    // async delete(id: number) {
    //     await this.verifyTeamById(id);
    //     await this.teamRepository.delete({ id });
    // }

    //예약 업데이트
    async updateReservation(showId: number, seat: number) {
        const show = await this.showRepository.findOneBy({ showId });
        const updatedSeat = show.current_seat += seat;

        await this.showRepository.update({ showId }, { current_seat: updatedSeat })
    }

}