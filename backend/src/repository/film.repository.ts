import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Film } from '../films/films.schema';
import { GetFilmDto, ScheduleDto } from '../films/dto/films.dto';

export interface IFilmsRepository {
  findAll(): Promise<{ total: number; items: GetFilmDto[] }>;
  findById(id: string): Promise<GetFilmDto>;
  updateFilmSchedule(id: string, schedule: ScheduleDto[]): Promise<boolean>;
  getFilmSchedule(id: string): Promise<ScheduleDto[]>;
}

@Injectable()
export default class FilmsRepository implements IFilmsRepository {
  constructor(
    @InjectModel(Film.name) private readonly filmModel: Model<Film>,
  ) {}

  async findAll(): Promise<{ total: number; items: GetFilmDto[] }> {
    const [films, total] = await Promise.all([
      this.filmModel.find({}).lean<GetFilmDto[]>(),
      this.filmModel.countDocuments({}),
    ]);
    return { total, items: films };
  }

  async findById(id: string): Promise<GetFilmDto> {
    try {
      return await this.filmModel
        .findOne({ id: id })
        .lean<GetFilmDto>()
        .orFail(() => new NotFoundException(`Film with id ${id} not found`));
    } catch (e) {
      throw new NotFoundException(`Film with id ${id} not found`);
    }
  }

  async updateFilmSchedule(
    id: string,
    schedule: ScheduleDto[],
  ): Promise<boolean> {
    const result = await this.filmModel.updateOne(
      { id: id },
      { $set: { schedule } },
    );
    if (result.modifiedCount === 0) {
      throw new NotFoundException(
        `Could not update schedule for film with ID ${id}.`,
      );
    }
    return true;
  }

  async getFilmSchedule(id: string): Promise<ScheduleDto[]> {
    const film = await this.findById(id);

    if (!film || !film.schedule || film.schedule.length === 0) {
      throw new NotFoundException(`Schedule for film with ID ${id} not found`);
    }

    return film.schedule;
  }
}
