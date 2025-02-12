import {
  Injectable,
  ConflictException,
  NotFoundException,
  Inject,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from 'src/app.config.provider';
import { OrderDTO, TicketDTO } from './dto/order.dto';
import { GetFilmDto } from '../films/dto/films.dto';
import { IFilmsRepository } from '../repository/film.repository';
import { OrdersRepository } from '../repository/order.repository';
import { Schedules } from '../films/dto/entities/schedule.entity';

@Injectable()
export class OrderService {
  private readonly databaseDriver: string;

  constructor(
    private configService: ConfigService,
    @Inject('FilmsRepository')
    private readonly filmsRepository: IFilmsRepository,
    private readonly ordersRepository: OrdersRepository,
  ) {
    this.databaseDriver =
      this.configService.get<AppConfig['database']>('app.database')?.driver;
  }

  private async getFilmsByTickets(
    tickets: OrderDTO['tickets'],
  ): Promise<GetFilmDto[]> {
    const filmIds = Array.from(new Set(tickets.map((ticket) => ticket.film)));
    const filmPromises = filmIds.map((filmId: string) =>
      this.filmsRepository.findById(filmId),
    );
    return Promise.all(filmPromises);
  }

  private validateTickets(
    tickets: OrderDTO['tickets'],
    films: GetFilmDto[],
  ): void {
    for (const ticket of tickets) {
      const film = films.find((f) => f.id === ticket.film);
      if (!film) {
        throw new NotFoundException(
          `Film with ticket ${ticket.film} not found`,
        );
      }

      const schedule = film.schedule.find((s) => s.daytime === ticket.daytime);

      if (!schedule) {
        throw new NotFoundException(
          `Film does not have session by: ID film ${ticket.film}, daytime ${ticket.daytime}`,
        );
      }

      if (
        schedule.taken &&
        schedule.taken.includes(`${ticket.row}:${ticket.seat}`)
      ) {
        throw new ConflictException(
          `Seat ${ticket.row}:${ticket.seat} is not available to reserve with ID ${ticket.film} and daytime ${ticket.daytime}`,
        );
      }
    }
  }

  private async updateTakenSeats(
    tickets: OrderDTO['tickets'],
    films: GetFilmDto[],
  ): Promise<void> {
    for (const ticket of tickets) {
      const film = films.find((f) => f.id === ticket.film);
      if (!film) continue;

      const schedule = film.schedule.find((s) => s.daytime === ticket.daytime);

      if (schedule) {
        let takenSeats: string[] = [];

        if (schedule.taken) {
          takenSeats = schedule.taken;
        }

        const selectedPlace = `${ticket.row}:${ticket.seat}`;

        if (this.databaseDriver === 'postgres') {
          if (!takenSeats.includes(selectedPlace)) {
            takenSeats.push(selectedPlace);
          }
        } else if (this.databaseDriver === 'mongodb') {
          if (!takenSeats.includes(selectedPlace)) {
            takenSeats.push(selectedPlace);
          }
        }

        schedule.taken = takenSeats;

        await this.filmsRepository.updateFilmSchedule(
          ticket.film,
          film.schedule as Schedules[],
        );
      }
    }
  }

  async reserveSeats(
    orderDTO: OrderDTO,
  ): Promise<{ total: number; items: TicketDTO[] }> {
    const films = await this.getFilmsByTickets(orderDTO.tickets);
    this.validateTickets(orderDTO.tickets, films);

    await this.updateTakenSeats(orderDTO.tickets, films);

    this.ordersRepository.createOrder(orderDTO);

    return {
      total: orderDTO.tickets.length,
      items: orderDTO.tickets,
    };
  }
}
