import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Order } from './order.entity';

@Entity({ name: 'tickets' })
export class Ticket {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  film: string;

  @Column()
  session: string;

  @Column()
  daytime: Date;

  @Column()
  day: Date;

  @Column()
  time: string;

  @Column()
  row: number;

  @Column()
  seat: number;

  @Column()
  price: number;

  @ManyToOne(() => Order, (order) => order.tickets)
  order: Order;
}
