import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IFilmsRepository } from '../repository/film.repository';
import { GetFilmDto } from './dto/films.dto';

@Injectable()
export class FilmsService {
  constructor(
    @Inject('FILM_REPOSITORY')
    private readonly filmsRepository: IFilmsRepository,
  ) {}

  private async handleDatabaseOperation<T>(
    operation: () => Promise<T>,
    operationDescription: string,
  ): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(
        `Failed to ${operationDescription}. Error: ${error.message}`,
      );
    }
  }

  private deserializeTags(film: GetFilmDto): GetFilmDto {
    if (film?.tags && typeof film.tags === 'string') {
      film.tags = film.tags.split(',').join(',');
    }
    return film;
  }

  async findAll(): Promise<{ total: number; items: GetFilmDto[] }> {
    const result = await this.handleDatabaseOperation(
      () => this.filmsRepository.findAll(),
      'get all films',
    );

    // Десериализация tags для каждого фильма
    result.items = result.items.map((film) => this.deserializeTags(film));

    return result;
  }

  async findById(id: string): Promise<GetFilmDto> {
    const film = await this.handleDatabaseOperation(async () => {
      return await this.filmsRepository.findById(id);
    }, `get film with ID ${id}`);

    // Десериализация tags
    return this.deserializeTags(film);
  }
}
