import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { Film } from '../films/dto/entities/film.entity';
import { Schedules } from '../films/dto/entities/schedule.entity';
import { Order } from '../order/dto/entities/order.entity';
import { Ticket } from '../order/dto/entities/ticket.entity';

@Module({
  imports: [
    process.env.DATABASE_DRIVER === 'mongodb'
      ? MongooseModule.forRootAsync({
          imports: [ConfigModule],
          useFactory: async (configService: ConfigService) => ({
            uri: configService.get<string>('DATABASE_URL'),
          }),
          inject: [ConfigService],
        })
      : TypeOrmModule.forRoot({
          type: 'postgres',
          host: process.env.DATABASE_HOST,
          port: +process.env.DATABASE_PORT,
          username: process.env.DATABASE_USERNAME,
          password: process.env.DATABASE_PASSWORD,
          database: process.env.DATABASE_NAME,
          entities: [Film, Schedules, Order],
          synchronize: false,
        }),
    TypeOrmModule.forFeature([Film, Schedules, Order, Ticket]),
  ],
})
export class DatabaseModule {}
