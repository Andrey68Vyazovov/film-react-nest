import { Entity, Column, ManyToOne, PrimaryColumn, JoinColumn } from 'typeorm';
import { Film } from './film.entity';

@Entity({ name: 'schedules' })
export class Schedules {
  @PrimaryColumn()
  id: string;

  @Column({ type: 'varchar', length: 255, name: 'film_id' })
  filmId: string;

  @Column()
  daytime: Date;

  @Column()
  hall: number;

  @Column()
  rows: number;

  @Column()
  seats: number;

  @Column()
  price: number;

  @Column('text', { array: true, default: [] })
  taken: string[];

  @ManyToOne(() => Film, (film) => film.schedules)
  @JoinColumn({ name: 'film_id', referencedColumnName: 'id' })
  film: Film;
}
