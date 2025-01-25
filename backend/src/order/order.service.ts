import { Injectable } from '@nestjs/common';
import { IFilmsRepository } from '../repository/film.repository';
import { OrderDTO } from './dto/order.dto';
import FilmsMongoRepository from '../repository/film.repository';
import { OrdersRepository } from '../repository/order.repository';

@Injectable()
export class OrderService {
  private filmsRepository: IFilmsRepository;

  constructor(
    private readonly filmsMongoRepository: FilmsMongoRepository,
    private readonly ordersRepository: OrdersRepository, 
  ) {
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
      const daytime = ticket.daytime;
      const price = ticket.price;

      if (!schedule.taken.includes(selectedPlace)) {
        reservedTickets.push({
          film: filmId,
          session,
          daytime,
          row,
          price,
          seat,
        });
        schedule.taken.push(selectedPlace);
      }
    }

    for (const film of films) {
      await this.filmsRepository.updateFilmSchedule(film.id, film.schedule);
    }

    this.ordersRepository.createOrder(orderDTO); // Сохранение заказа
     return {
      total: reservedTickets.length,
      items: reservedTickets,
    };
  }
}