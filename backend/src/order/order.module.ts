import { DynamicModule, Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { ConfigModule } from '@nestjs/config';
import { OrdersRepository } from '../repository/order.repository';
import { OrderService } from './order.service';
import { FilmsModule } from '../films/films.module';

@Module({})
export class OrderModule {
  static forRootAsync(): DynamicModule {
    return {
      module: OrderModule,
      imports: [ConfigModule, FilmsModule],
      controllers: [OrderController],
      providers: [OrdersRepository, OrderService],
    };
  }
}
