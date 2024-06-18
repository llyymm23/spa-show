import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { User } from '../../user/entities/user.entity';
import { Seat } from 'src/show/entities/seat.entity';

@Entity({
    name: 'reservations',
})
export class Reservation {
    @PrimaryGeneratedColumn({ unsigned: true })
    reservationId: number;

    @Column({ unsigned: true })
    userId: number;

    @Column({ unsigned: true })
    seatId: number;

    @Column({ unsigned: true })
    showId: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => User, (user) => user.reservations, {
        onDelete: 'CASCADE'
    })
    user: User;

    @OneToOne(() => Seat, (seat) => seat.reservation, {
        onDelete: 'CASCADE'
    })
    @JoinColumn()
    seat: Seat;
}
