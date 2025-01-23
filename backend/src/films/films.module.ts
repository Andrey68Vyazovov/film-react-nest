import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { configProvider } from '../app.config.provider';
import { Film, FilmSchema } from './films.schema';
import { FilmsController } from './films.controller';
import  FilmsRepository  from '../repository/film.repository';
import { FilmsService } from './films.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature([{ name: Film.name, schema: FilmSchema }]),
  ],
  controllers: [FilmsController],
  providers: [configProvider, FilmsRepository, FilmsService],
  exports: [FilmsRepository],
})
export class FilmsModule {}