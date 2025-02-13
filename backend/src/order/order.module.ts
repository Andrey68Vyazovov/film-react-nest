import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { ConfigModule } from '@nestjs/config';
import { OrdersRepository } from '../repository/order.repository';
import { OrderService } from './order.service';
import { FilmsModule } from '../films/films.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ticket } from './dto/entities/ticket.entity';
import { Order } from './dto/entities/order.entity';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [
    ConfigModule,
    FilmsModule,
    TypeOrmModule.forFeature([Ticket, Order]),
    DatabaseModule,
  ],
  controllers: [OrderController],
  providers: [OrdersRepository, OrderService],
  exports: [OrdersRepository, OrderService],
})
export class OrderModule {}
