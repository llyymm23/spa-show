import _, { find } from 'lodash';
import { parse } from 'papaparse';
import { Like, Repository } from 'typeorm';

import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

//import { UpdateShowDto } from './dto/update-show.dto';
import { Show } from './entities/show.entity';
import { Seat } from './entities/seat.entity';
import { CreateShowDto } from './dto/create-show.dto';
import { FindShowDto } from './dto/find-show.dto';

@Injectable()
export class ShowService {
    constructor(
        @InjectRepository(Show) private readonly showRepository: Repository<Show>,
        @InjectRepository(Seat) private readonly seatRepository: Repository<Seat>,
    ) { }

    //새 공연 등록하기
    async create(createshowDto: CreateShowDto) {
        if (createshowDto.price.some(price => price > 50000)) {
            throw new BadRequestException('가격은 5만 포인트를 넘을 수 없습니다.');
        }

        // date 필드에서 날짜와 시간을 분리
        const dateObject = new Date(createshowDto.date);

        // ISO 8601 형식에서 날짜 부분만 추출
        const datePart = dateObject.toISOString().split('T')[0]; // 'YYYY-MM-DD'

        // ISO 8601 형식에서 시간 부분만 추출
        const timePart = dateObject.toTimeString().split(' ')[0]; // 'HH:mm:ss'

        //새 공연 등록
        const show = await this.showRepository.save({
            title: createshowDto.title,
            info: createshowDto.info,
            date: datePart,
            time: timePart,
            category: createshowDto.category,
            address: createshowDto.address,
            image: createshowDto.image,
            reservationStart: createshowDto.reservationStart,
            reservationEnd: createshowDto.reservationEnd,
        });

        //좌석 등록
        for (let i = 0; i < createshowDto.grade.length; i++) {
            const grade = createshowDto.grade[i];
            const price = createshowDto.price[i];

            for (let j = 1; j <= createshowDto.seat[i]; j++) {
                await this.seatRepository.save({
                    showId: show.showId,
                    grade: grade,
                    price: price,
                    seatNum: j,
                });
            }
        }

        return show;
    }

    //공연 검색하기(키워드,카테고리,이름 검색)
    async findShow(findShowDto: FindShowDto) {
        const { keyword, category, title } = findShowDto;
        const shows = await this.showRepository.find({
            where: { ...(keyword && { title: Like(`%${keyword}%`) }), ...(category && { category }), ...(title && { title }) },
        });

        return shows;
    }

    //공연 상세 보기
    // - 해당 공연의 정보를 반환합니다.
    // - 현재 예매가 가능한지 여부를 반환합니다.
    async findOne(showId: number) {
        const show = await this.showRepository.findOne({ where: { showId } });

        if (_.isNil(show)) {
            throw new NotFoundException('존재하지 않는 공연입니다.');
        }

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
}