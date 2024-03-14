import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { ShowCategory } from '../types/show-category.type';
import { Schedule } from './schedule.entity';

@Entity({
    name: 'shows',
})
export class Show {
    @PrimaryGeneratedColumn({ unsigned: true })
    showId: number;

    @Column()
    title: string;

    @Column()
    info: string;

    @Column({ type: 'enum', enum: ShowCategory })
    category: ShowCategory;

    @Column()
    address: string;

    @Column()
    image: string;

    @Column()
    price: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => Schedule, (schedule) => schedule.show, { cascade: true })
    schedules: Schedule[];
}