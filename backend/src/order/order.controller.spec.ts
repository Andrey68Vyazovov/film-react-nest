import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { OrderDTO } from './dto/order.dto';

describe('OrderController', () => {
  let controller: OrderController;
  let service: OrderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        {
          provide: OrderService,
          useValue: {
            reserveSeats: jest.fn().mockResolvedValue({
              total: 1,
              items: [
                {
                  film: 'film-id',
                  session: 'session-id',
                  daytime: '2024-06-28T10:00:53+03:00',
                  row: 1,
                  seat: 1,
                  price: 350,
                },
              ],
            }),
          },
        },
      ],
    }).compile();

    controller = module.get<OrderController>(OrderController);
    service = module.get<OrderService>(OrderService);
  });

  it('should create an order and use getOrderData', async () => {
    const orderDTO: OrderDTO = {
      email: 'test@yandex.ru',
      phone: '79057777777',
      tickets: [
        {
          film: 'film-id',
          session: 'session-id',
          daytime: '2024-06-28T10:00:53+03:00',
          row: 1,
          seat: 1,
          price: 350,
        },
      ],
      get getOrderData(): {
        filmId: string;
        sessionId: string;
        seatsSelection: string;
      }[] {
        return this.tickets.map((ticket) => ({
          filmId: ticket.film,
          sessionId: ticket.session,
          seatsSelection: `${ticket.row}:${ticket.seat}`,
        }));
      },
    };

    const orderData = orderDTO.getOrderData;
    expect(orderData).toEqual([
      {
        filmId: 'film-id',
        sessionId: 'session-id',
        seatsSelection: '1:1',
      },
    ]);

    const result = await controller.createOrder(orderDTO);
    expect(result).toEqual({
      total: 1,
      items: [
        {
          film: 'film-id',
          session: 'session-id',
          daytime: '2024-06-28T10:00:53+03:00',
          row: 1,
          seat: 1,
          price: 350,
        },
      ],
    });

    expect(service.reserveSeats).toHaveBeenCalledWith(orderDTO);
  });
});
