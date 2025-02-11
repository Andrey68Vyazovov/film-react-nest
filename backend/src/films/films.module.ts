import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Film, FilmSchema } from './films.schema';
import { FilmsController } from './films.controller';
import FilmsRepository from '../repository/film.repository';
import { FilmsService } from './films.service';
import { Film as FilmEntity } from './dto/entities/film.entity';

@Module({
  imports: [
    ConfigModule,
    process.env.DATABASE_DRIVER === 'mongodb'
      ? MongooseModule.forFeature([{ name: Film.name, schema: FilmSchema }])
      : TypeOrmModule.forFeature([FilmEntity]),
  ],
  controllers: [FilmsController],
  providers: [
    FilmsService,
    { provide: 'FILM_REPOSITORY', useClass: FilmsRepository },
  ],
  exports: ['FILM_REPOSITORY'],
})
export class FilmsModule {}
