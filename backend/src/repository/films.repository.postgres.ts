import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Film } from '../films/dto/entities/film.entity';
import { Schedules } from '../films/dto/entities/schedule.entity';

@Injectable()
export class FilmsRepositoryPostgres {
  constructor(
    @InjectRepository(Film)
    private readonly filmsRepository: Repository<Film>,
  ) {}

  async findAll(): Promise<{ total: number; items: Film[] }> {
    const [items, total] = await this.filmsRepository.findAndCount();
    return { total, items };
  }

  async findById(id: string): Promise<Film> {
    const film = await this.filmsRepository.findOne({
      where: { id },
      relations: { schedule: true },
    });

    if (!film) {
      throw new NotFoundException(`Film with ID ${id} not found`);
    }
    return film;
  }

  async updateFilmSchedule(
    id: string,
    schedule: Schedules[],
  ): Promise<{ acknowledged: boolean; modifiedCount: number }> {
    const film = await this.findById(id);
    film.schedule = schedule;
    await this.filmsRepository.save(film);
    return { acknowledged: true, modifiedCount: schedule.length };
  }
}
