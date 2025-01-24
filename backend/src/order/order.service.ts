import { Injectable } from '@nestjs/common';
import { IFilmsRepository } from '../repository/film.repository';
import { OrderDTO } from './dto/order.dto';
import FilmsMongoRepository from '../repository/film.repository';

@Injectable()
export class OrderService {
  private filmsRepository: IFilmsRepository;

  constructor(private readonly filmsMongoRepository: FilmsMongoRepository) {
    this.filmsRepository = this.filmsMongoRepository;
  }

  async reserveSeats(orderDTO: OrderDTO): Promise<any> {
    const { tickets } = orderDTO;
    const reservedTickets = [];

    const filmIds = Array.from(new Set(tickets.map((ticket) => ticket.film)));
    const films = await Promise.all(
      filmIds.map((filmId) => this.filmsRepository.findById(filmId)),
    );

    for (const ticket of tickets) {
      const { film: filmId, session, row, seat } = ticket;
      const film = films.find((f) => f.id === filmId);
      const selectedPlace = `${row}:${seat}`;

      const schedule = film.schedule.find((s) => s.id === session);

      if (!schedule.taken.includes(selectedPlace)) {
        reservedTickets.push({
          film: filmId,
          session,
          row,
          seat,
        });
        schedule.taken.push(selectedPlace);
      }
    }

      for(const film of films){
         await this.filmsRepository.updateFilmSchedule(film.id, film.schedule);
        }      

    return {
      total: reservedTickets.length,
      items: reservedTickets,
    };
  }
}