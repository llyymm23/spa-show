import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Show } from './show.entity';
import { Reservation } from 'src/reservation/entities/reservation.entity';
import { Grade } from '../types/seat.type';
import { seatStatus } from '../types/seatStatus.type';

@Entity({
    name: 'seats',
})
export class Seat {
    @PrimaryGeneratedColumn({ unsigned: true })
    seatId: number;

    @Column({ unsigned: true })
    showId: number;

    @Column({ unsigned: true })
    grade: Grade;

    @Column({ unsigned: true })
    price: number;

    @Column({ unsigned: true })
    seatNum: number;

    @Column({ unsigned: true, default: seatStatus.empty })
    seatStatus: seatStatus;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => Show, (show) => show.seats, {
        onDelete: 'CASCADE'
    })
    show: Show;

    @OneToOne(() => Reservation, reservation => reservation.seat)
    @JoinColumn()
    reservation: Reservation;
}