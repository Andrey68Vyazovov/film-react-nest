import { Controller, Get, Param } from '@nestjs/common';
import { FilmsService } from './films.service';
import {
  GetFilmDto,
  FilmScheduleParams,
  GetScheduleDto,
} from './dto/films.dto';
import { Film } from './dto/entities/film.entity';
import { Schedules } from './dto/entities/schedule.entity';

@Controller('films')
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) {}
  @Get('/')
  getFilms(): Promise<{ total: number; items: GetFilmDto[] | Film[] }> {
    return this.filmsService.findAll();
  }
  @Get(':id/schedule')
  getFilmSchedule(
    @Param() params: FilmScheduleParams,
  ): Promise<{ total: number; items: GetScheduleDto[] | Schedules[] }> {
    return this.filmsService.findById(params.id);
  }
}
