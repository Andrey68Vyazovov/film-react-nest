import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { Film, FilmSchema } from './films.schema';
import { FilmsController } from './films.controller';
import FilmsRepository from '../repository/film.repository';
import { FilmsService } from './films.service';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([{ name: Film.name, schema: FilmSchema }]),
  ],
  controllers: [FilmsController],
  providers: [FilmsRepository, FilmsService],
  exports: [FilmsRepository],
})
export class FilmsModule {}
