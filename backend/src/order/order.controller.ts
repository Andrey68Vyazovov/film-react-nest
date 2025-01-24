import { Controller, Post, Body } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderDTO } from './dto/order.dto';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async createOrder(@Body() orderDTO: OrderDTO) {
    const orderData = await this.orderService.reserveSeats(orderDTO);
    return { items: orderData };
  }
}   
