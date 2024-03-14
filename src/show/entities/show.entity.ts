import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Reservation } from '../../reservation/entities/reservation.entity'

@Entity({
    name: 'shows',
})
export class Show {
    @PrimaryGeneratedColumn()
    showId: number;

    @Column({ type: 'varchar', nullable: false })
    title: string;

    @Column({ type: 'text', nullable: false })
    info: string;

    @Column({ type: 'varchar', nullable: false })
    date: string;

    @Column({ type: 'varchar', nullable: false })
    address: string;

    @Column({ type: 'int', nullable: false })
    total_seat: number;

    @Column({ type: 'int', nullable: false, default: 0 })
    current_seat: number;

    // @Column({ type: 'varchar' })
    // image: string;

    @Column({ type: 'varchar', nullable: false })
    category: string;

    @Column({ type: 'int', nullable: false })
    price: number;

    @OneToMany(() => Reservation, (reservation) => reservation.showId)
    reservation: Reservation[];
}