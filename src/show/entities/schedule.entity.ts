import { createDecipheriv } from "crypto";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

import { Show } from "./show.entity";
import { Seat } from "./seat.entity";
import { Reservation } from "src/reservation/entities/reservation.entity";

@Entity({
    name: 'schedules'
})
export class Schedule {
    @PrimaryGeneratedColumn({ unsigned: true })
    scheduleId: number;

    @Column({ unsigned: true })
    showId: number;

    @Column({ type: 'date' })
    date: Date;

    @Column({ type: 'time' })
    time: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => Show, (show) => show.schedules, { onDelete: 'CASCADE' })
    show: Show;

    @OneToOne(() => Seat, (seat) => seat.schedule, { cascade: true })
    seat: Seat;


    @OneToMany(() => Reservation, (reservations) => reservations.schedule, { cascade: true })
    reservations: Reservation[];
}