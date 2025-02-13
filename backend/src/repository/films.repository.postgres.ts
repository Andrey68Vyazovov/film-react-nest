import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Film } from '../films/dto/entities/film.entity';
import { Schedules } from '../films/dto/entities/schedule.entity';
import {
  GetFilmDto,
  ScheduleDto,
  GetScheduleDto,
} from '../films/dto/films.dto';

export interface IFilmsRepository {
  findAll(): Promise<{ total: number; items: GetFilmDto[] }>;
  findById(id: string): Promise<GetFilmDto>;
  updateFilmSchedule(id: string, schedule: ScheduleDto[]): Promise<boolean>;
  getFilmSchedule(id: string): Promise<GetScheduleDto[]>;
}

@Injectable()
export class FilmsRepositoryPostgres implements IFilmsRepository {
  constructor(
    @InjectRepository(Film)
    private readonly filmsRepository: Repository<Film>,
    @InjectRepository(Schedules)
    private readonly schedulesRepository: Repository<Schedules>,
  ) {}

  async findAll(): Promise<{ total: number; items: GetFilmDto[] }> {
    const [items, total] = await this.filmsRepository.findAndCount({
      relations: ['schedule'],
    });
    return { total, items: items as GetFilmDto[] };
  }

  async findById(id: string): Promise<GetFilmDto> {
    const film = await this.filmsRepository.findOne({
      where: { id },
      relations: { schedule: true },
    });

    if (!film) {
      throw new NotFoundException(`Film with ID ${id} not found`);
    }
    return film as GetFilmDto;
  }

  async updateFilmSchedule(
    id: string,
    scheduleDtos: ScheduleDto[],
  ): Promise<boolean> {
    try {
      const film = await this.findById(id);

      // Создаем карту существующих расписаний по daytime
      const existingSchedulesMap = new Map(
        film.schedule.map((schedule) => [schedule.daytime, schedule]),
      );

      // Обновляем или создаем расписания на основе DTOs
      const updatedSchedules: Schedules[] = scheduleDtos.map((scheduleDto) => {
        const schedule =
          existingSchedulesMap.get(scheduleDto.daytime) || new Schedules();
        schedule.daytime = scheduleDto.daytime;
        schedule.hall = scheduleDto.hall;
        schedule.rows = scheduleDto.rows;
        schedule.seats = scheduleDto.seats;
        schedule.price = scheduleDto.price;
        schedule.taken = scheduleDto.taken;
        schedule.film = film;
        return schedule;
      });

      film.schedule = updatedSchedules; // Присваиваем обновленный массив

      await this.filmsRepository.save(film); // Сохраняем фильм с обновленным расписанием
      return true;
    } catch (error) {
      console.error('Error updating film schedule:', error);
      return false;
    }
  }

  async getFilmSchedule(id: string): Promise<GetScheduleDto[]> {
    const film = await this.findById(id);
    if (!film || !film.schedule) {
      throw new NotFoundException(`Schedule for film with ID ${id} not found`);
    }
    return film.schedule as GetScheduleDto[];
  }
}
