import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Show } from './show.entity';

@Entity({
    name: 'seats',
})
export class Seat {
    @PrimaryGeneratedColumn({ unsigned: true })
    seatId: number;

    @Column({ unsigned: true })
    showId: number;

    @Column({ unsigned: true })
    grade: number;

    @Column({ unsigned: true })
    price: number;

    @Column({ unsigned: true })
    seat_num: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => Show, (show) => show.seats, {
        onDelete: 'CASCADE'
    })
    show: Show;
}