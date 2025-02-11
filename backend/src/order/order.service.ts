import {
  Injectable,
  ConflictException,
  NotFoundException,
  Inject,
} from '@nestjs/common';
import { IFilmsRepository } from '../repository/film.repository';
import { OrderDTO } from './dto/order.dto';
import FilmsRepository from '../repository/film.repository';

@Injectable()
export class OrderService {
  private activeRepository: IFilmsRepository;

  constructor(
    @Inject('FilmsRepository')
    private readonly filmsRepository: IFilmsRepository,
  ) {
    this.activeRepository = this.filmsRepository;
  }

  async reserveSeat(orderDTO: OrderDTO) {
    const { tickets } = orderDTO;
    const reservedTickets = [];

    for (const ticket of tickets) {
      const { film, session, row, seat } = ticket;
      const selectedPlace = `${row}:${seat}`;
      let selectedFilm;

      this.activeRepository instanceof FilmsRepository
        ? (selectedFilm = await this.activeRepository.findById(film))
        : (selectedFilm = await this.activeRepository.findById(film, [
            'schedule',
          ]));

      if (!selectedFilm) {
        throw new NotFoundException(`Film with session ${film} not found`);
      }

      const schedule = selectedFilm.schedule.find((s) => s.id === session);
      let taken = schedule.taken;

      if (!schedule) {
        throw new NotFoundException(`Film does not have session by ${session}`);
      }

      if (!Array.isArray(taken)) {
        taken = taken ? [taken] : [];
      }

      if (taken.includes(selectedPlace)) {
        throw new ConflictException(
          `Seat ${selectedPlace} is not available to reserve`,
        );
      }

      taken.push(selectedPlace);

      reservedTickets.push({
        film,
        session,
        row,
        seat,
      });

      await this.activeRepository.updateFilm(selectedFilm);

      return reservedTickets;
    }
  }
}