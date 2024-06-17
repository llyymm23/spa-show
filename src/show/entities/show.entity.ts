import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { ShowCategory } from '../types/show-category.type';
import { Reservation } from 'src/reservation/entities/reservation.entity';
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

    @Column({ type: 'enum', enum: ShowCategory })
    category: ShowCategory;

    @Column({ type: 'varchar', nullable: false })
    address: string;

    @Column({ type: 'varchar', nullable: false })
    image: string;

    @Column({ type: 'varchar', nullable: false })
    price: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => Reservation, (reservation) => reservation.show)
    reservations: Reservation[];

    @OneToMany(() => Seat, (seat) => seat.show)
    seats: Seat[];
}