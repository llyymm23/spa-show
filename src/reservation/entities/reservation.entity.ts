import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Show } from '../../show/entities/show.entity';
import { User } from '../../user/entities/user.entity';

@Entity({
    name: 'reservation',
})
export class Reservation {
    @PrimaryGeneratedColumn()
    reservationId: number;

    @Column()
    seat: number;

    @ManyToOne(() => User, (user) => user.reservation, {
        onDelete: 'CASCADE'
    })
    user: User;

    @Column({ type: 'bigint', name: 'userId' })
    id: number;

    @ManyToOne(() => Show, (show) => show.reservation, {
        onDelete: 'CASCADE',
    })
    show: Show;

    @Column({ type: 'bigint', name: 'showId' })
    showId: number;

    @CreateDateColumn()
    createdAt: Date;
}
