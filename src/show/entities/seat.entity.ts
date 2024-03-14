import { Column, CreateDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Schedule } from './schedule.entity';

@Entity({
    name: 'seats',
})
export class Seat {
    @PrimaryGeneratedColumn({ unsigned: true })
    seatId: number;

    @Column({ unsigned: true })
    scheduleId: number;

    @Column({ unsigned: true })
    current_seat: number;

    @Column({ unsigned: true })
    total_seat: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToOne(() => Schedule, (schedule) => schedule.seat)
    @JoinColumn()
    schedule: Schedule;
}