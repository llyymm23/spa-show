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
import { SearchShowDTO } from './dto/search-show.dto';
import { CreateShowDto } from './dto/create-show.dto';
import { Schedule } from './entities/schedule.entity';
import { Seat } from './entities/seat.entity';
import { FindAllShowDto } from './dto/find-all-show.dto';

@Injectable()
export class ShowService {
    constructor(
        @InjectRepository(Show) private readonly showRepository: Repository<Show>,
        @InjectRepository(Seat) private readonly seatRepository: Repository<Seat>,
        @InjectRepository(Schedule) private readonly scheduleRepository: Repository<Schedule>,
    ) { }

    //새 공연 등록하기
    async create(createshowDto: CreateShowDto) {
        if (createshowDto.price > 50000) {
            throw new BadRequestException('가격은 5만 포인트를 넘을 수 없습니다.');
        }

        //새 공연 등록
        const show = await this.showRepository.save({
            title: createshowDto.title,
            info: createshowDto.info,
            category: createshowDto.category,
            address: createshowDto.address,
            image: createshowDto.image,
            price: createshowDto.price
        });

        //시간 등록
        const schedule = await this.scheduleRepository.save({
            showId: show.showId,
            date: createshowDto.date,
            time: createshowDto.time
        })

        //좌석수 등록
        await this.seatRepository.save({
            scheduleId: schedule.scheduleId,
            total_seat: createshowDto.total_seat,
            current_seat: createshowDto.total_seat
        })

    }

    //공연 목록 보기
    // - 공연의 리스트를 조회합니다.
    // - 전체, 공연명별로 나뉘어서 조회 가능합니다. 
    async findAll(findAllShowDto: FindAllShowDto) {
        const { keyword, category } = findAllShowDto;
        const shows = await this.showRepository.find({
            where: { ...(keyword && { title: Like(`%${keyword}%`) }), ...(category && { category }) },
        });

        return shows;
    }

    //공연 상세 보기
    // - 해당 공연의 정보를 반환합니다.
    // - 현재 예매가 가능한지 여부를 반환합니다.
    async findOne(showId: number) {
        const show = await this.showRepository.findOne({
            where: { showId },
            relations: {
                schedules: {
                    seat: true,
                }
            }
        });

        console.log(show);

        if (_.isNil(show)) {
            throw new NotFoundException('존재하지 않는 공연입니다.');
        }

        return show;
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
}