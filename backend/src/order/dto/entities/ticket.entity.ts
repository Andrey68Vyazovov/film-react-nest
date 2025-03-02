import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Order } from './order.entity';
import {
  IsNumber,
  IsPositive,
  IsString,
  Length,
  IsDate,
} from 'class-validator';

@Entity({ name: 'tickets' })
export class Ticket {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  @IsString()
  @Length(1, 255)
  film: string;

  @Column({ type: 'varchar', length: 255 })
  @IsString()
  @Length(1, 255)
  session: string;

  @Column({ type: 'timestamp' })
  @IsDate()
  daytime: Date;

  @Column({ type: 'date' })
  @IsDate()
  day: Date;

  @Column({ type: 'varchar', length: 50 })
  @IsString()
  @Length(1, 50)
  time: string;

  @Column({ type: 'int' })
  @IsNumber()
  @IsPositive()
  row: number;

  @Column({ type: 'int' })
  @IsNumber()
  @IsPositive()
  seat: number;

  @Column({ type: 'float' })
  @IsNumber()
  @IsPositive()
  price: number;

  @ManyToOne(() => Order, (order) => order.tickets)
  order: Order;
}
