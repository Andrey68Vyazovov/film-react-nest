//TODO реализовать DTO для /orders

import { Type } from 'class-transformer';
import { IsString, IsNumber, IsArray } from 'class-validator';

export class TicketDTO {
  @IsString()
  film: string;

  @IsString()
  session: string;

  @IsNumber()
  row: number;

  @IsNumber()
  seat: number;
}

export class OrderDTO {
  @IsString()
  email: string;

  @IsString()
  phone: string;

  @IsArray()
  @Type(() => TicketDTO)
  tickets: TicketDTO[];
}
