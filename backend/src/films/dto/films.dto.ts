//TODO описать DTO для запросов к /films
export class ScheduleDto {
  daytime: string;
  hall: number;
  rows: number;
  seats: number;
  price: number;
  taken: string[];
}

export class GetScheduleDto extends ScheduleDto {
  id: string;
}

export class GetFilmDto {
  id: string;
  rating: number;
  director: string;
  tags: string[];
  title: string;
  about: string;
  description: string;
  image: string;
  cover: string;
  schedule: GetScheduleDto[];
}
export class CreateScheduleDto extends ScheduleDto {}

export class CreateFilmDto {
  readonly rating: number;
  readonly director: string;
  readonly tags: string[];
  readonly image: string;
  readonly cover: string;
  readonly title: string;
  readonly about: string;
  readonly description: string;
  readonly schedule: GetScheduleDto[];
}
export class FilmScheduleParams {
  id: string;
}