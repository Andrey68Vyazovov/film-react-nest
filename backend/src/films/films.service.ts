import { Injectable, NotFoundException } from '@nestjs/common';
import FilmsRepository, { IFilmsRepository } from '../repository/film.repository';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from '../app.config.provider';
import { GetFilmDto, GetScheduleDto } from './dto/films.dto';

@Injectable()
export class FilmsService {
  private filmsRepository: IFilmsRepository;

  constructor(
    private configService: ConfigService,
    private readonly mongoRepository: FilmsRepository,
  ) {
    this.filmsRepository = this.mongoRepository;
    this.ensureMongoDriver();
  }

  private ensureMongoDriver(): void {
    const databaseDriver =
      this.configService.get<AppConfig['database']>('app.database')?.driver;
    if (databaseDriver !== 'mongodb') {
      throw new Error('Unsupported database driver');
    }
  }

  private async handleDatabaseOperation<T>(
    operation: () => Promise<T>,
    operationDescription: string,
  ): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error; // Передаём NotFoundException без изменений
      }
      throw new Error(
        `Failed to ${operationDescription}. Error: ${error.message}`,
      );
    }
  }

  async findAll(): Promise<{ total: number; items: GetFilmDto[] }> {
    this.ensureMongoDriver();
    return this.handleDatabaseOperation(
      () => this.filmsRepository.findAll(),
      'get all films',
    );
  }
  async findById(
    id: string,
  ): Promise<{ total: number; items: GetScheduleDto[] }> {
    this.ensureMongoDriver();
    return this.handleDatabaseOperation(async () => {
      const result = await this.filmsRepository.findById(id);
      return { total: result.schedule.length, items: result.schedule };
    }, `get film with ID ${id}`);
  }
}