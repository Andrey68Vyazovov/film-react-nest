//TODO реализовать DTO для /orders
import { Type } from 'class-transformer';
import {
  IsString,
  IsNumber,
  IsArray,
  IsOptional,
  ValidateNested,
} from 'class-validator';

export class TicketDTO {
  @IsString()
  film: string;

  @IsString()
  session: string;

  @IsString()
  daytime: string;

  @IsNumber()
  row: number;

  @IsNumber()
  seat: number;

  @IsNumber()
  price: number;
}

class ContactsDto {
  @IsString()
  email: string;

  @IsString()
  phone: string;
}

export class OrderDTO extends ContactsDto {
  @IsString()
  @IsOptional()
  id?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TicketDTO)
  tickets: TicketDTO[];

  get getOrderData(): PlaceTicketDto[] {
    return this.tickets.map((ticket) => ({
      filmId: ticket.film,
      sessionId: ticket.session,
      seatsSelection: `${ticket.row}:${ticket.seat}`,
    }));
  }
}

export class PlaceTicketDto {
  @IsString()
  filmId: string;

  @IsString()
  sessionId: string;

  @IsString()
  seatsSelection: string;
}
