import {
  Controller,
  Get,
  Param,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
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
  async getFilms(): Promise<{ total: number; items: GetFilmDto[] }> {
    try {
      return await this.filmsService.findAll();
    } catch (error) {
      throw new InternalServerErrorException('Failed to get films');
    }
  }

  @Get(':id/schedule')
  async getFilmSchedule(
    @Param() params: FilmScheduleParams,
  ): Promise<{ total: number; items: GetScheduleDto[] }> {
    try {
      const film = await this.filmsService.findById(params.id);
      return { total: film.schedule.length, items: film.schedule };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to get film schedule');
    }
  }
}
