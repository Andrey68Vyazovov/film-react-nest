import { Injectable } from '@nestjs/common';
import { faker } from '@faker-js/faker';
import { OrderDTO, TicketDTO } from '../order/dto/order.dto';

@Injectable()
export class OrdersRepository {
  private orders: OrderDTO[] = [];

  private generateTicketsWithId(tickets: TicketDTO[]): TicketDTO[] {
    return tickets.map((ticket) => ({
      ...ticket,
      id: faker.string.uuid(),
    }));
  }

  createOrder(order: OrderDTO): OrderDTO {
    const ticketsWithId = this.generateTicketsWithId(order.tickets);
    const newOrder = new OrderDTO();
    newOrder.email = order.email;
    newOrder.phone = order.phone;
    newOrder.tickets = ticketsWithId;
    this.orders.push(newOrder);
    return newOrder;
  }
}