//TODO реализовать DTO для /orders

import { Type } from 'class-transformer';
import { IsString, IsNumber, IsArray, IsDate, IsOptional } from 'class-validator';

export class TicketDTO {
  @IsString()
  film: string;

  @IsString()
  session: string;

  @IsDate()
  daytime: Date;

  @IsNumber()
  row: number;

  @IsNumber()
  seat: number;

  @IsNumber()
  price: number;
}

export class OrderDTO {
  @IsString()
  @IsOptional()
  id?: string;

  @IsString()
  email: string;

  @IsString()
  phone: string;

  @IsArray()
  @Type(() => TicketDTO)
  tickets: TicketDTO[];
}
