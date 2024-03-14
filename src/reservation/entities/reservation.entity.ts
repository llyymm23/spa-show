import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { User } from '../../user/entities/user.entity';
import { Schedule } from 'src/show/entities/schedule.entity';

@Entity({
    name: 'reservations',
})
export class Reservation {
    @PrimaryGeneratedColumn({ unsigned: true })
    reservationId: number;

    @Column({ unsigned: true })
    userId: number;

    @Column({ unsigned: true })
    scheduleId: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => User, (user) => user.reservations, {
        onDelete: 'CASCADE'
    })
    user: User;

    @ManyToOne(() => Schedule, (schedule) => schedule.reservations, {
        onDelete: 'CASCADE'
    })
    schedule: Schedule;
}
