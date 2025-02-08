import { Controller, Get, Param } from '@nestjs/common';
import { FilmsService } from './films.service';
import {
  GetFilmDto,
  FilmScheduleParams,
  GetScheduleDto,
} from './dto/films.dto';

@Controller('films')
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) {}
  @Get('/')
  getFilms(): Promise<{ total: number; items: GetFilmDto[] }> {
    return this.filmsService.findAll();
  }
  @Get(':id/schedule')
  getFilmSchedule(
    @Param() params: FilmScheduleParams,
  ): Promise<{ total: number; items: GetScheduleDto[] }> {
    return this.filmsService.findById(params.id);
  }
}
