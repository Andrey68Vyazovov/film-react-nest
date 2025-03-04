import { Entity, Column, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Ticket } from './ticket.entity';
import { IsEmail, IsString, IsNotEmpty } from 'class-validator';

@Entity({ name: 'orders' })
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Column({ type: 'varchar', length: 20 })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @OneToMany(() => Ticket, (ticket) => ticket.order)
  tickets: Ticket[];
}
