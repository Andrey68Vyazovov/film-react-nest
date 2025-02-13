import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Film } from '../films/dto/entities/film.entity';
import { Schedules } from '../films/dto/entities/schedule.entity';
import { Ticket } from '../order/dto/entities/ticket.entity';
import { Order } from '../order/dto/entities/order.entity';
import { FilmsRepositoryPostgres } from 'src/repository/films.repository.postgres';
import FilmsRepository from 'src/repository/film.repository';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type:
          configService.get<string>('DATABASE_DRIVER') === 'postgres'
            ? 'postgres'
            : 'mongodb',
        host: configService.get<string>('DATABASE_HOST'),
        port: parseInt(configService.get<string>('DATABASE_PORT'), 10),
        username: configService.get<string>('DATABASE_USERNAME'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        database: configService.get<string>('DATABASE_NAME'),
        entities: [Film, Schedules, Ticket],
        synchronize: false,
        autoLoadEntities: true,
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Film, Schedules, Ticket, Order]),
  ],
  providers: [
    FilmsRepositoryPostgres, // Оставляем только FilmsRepositoryPostgres
    {
      provide: 'FILM_REPOSITORY',
      useFactory: (
        configService: ConfigService,
        postgresRepo: FilmsRepositoryPostgres,
        mongoRepo: FilmsRepository, // Убираем mongoRepo
      ) => {
        const driver = configService.get<string>('DATABASE_DRIVER');
        if (driver === 'postgres') {
          return postgresRepo;
        } else {
          throw new Error('MongoDB is not supported yet');
          return mongoRepo;
        }
      },
      inject: [ConfigService, FilmsRepositoryPostgres], // Убираем mongoRepo
    },
  ],
  exports: [TypeOrmModule, 'FILM_REPOSITORY'],
})
export class DatabaseModule {}
