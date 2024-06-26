import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { ShowCategory } from '../types/show-category.type';
import { Seat } from './seat.entity';

@Entity({
    name: 'shows',
})
export class Show {
    @PrimaryGeneratedColumn({ unsigned: true })
    showId: number;

    @Column({ type: 'varchar', nullable: false })
    title: string;

    @Column({ type: 'text', nullable: false })
    info: string;

    @Column({ type: 'date', nullable: false })
    date: string;

    @Column({ type: 'time', nullable: false })
    time: string;

    @Column({ type: 'enum', enum: ShowCategory })
    category: ShowCategory;

    @Column({ type: 'varchar', nullable: false })
    address: string;

    @Column({ type: 'varchar', nullable: false })
    image: string;

    @Column({ type: 'varchar', nullable: false })
    reservationStart: string;

    @Column({ type: 'varchar', nullable: false })
    reservationEnd: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => Seat, (seat) => seat.show)
    seats: Seat[];
}