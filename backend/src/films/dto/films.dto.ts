import { IsString, IsNumber, IsArray, IsInt, Min, Max } from 'class-validator';
import { Schedules } from './entities/schedule.entity'; // Import the Schedules entity

export class ScheduleDto {
  @IsString()
  daytime: string;
  @IsInt()
  @Min(1)
  hall: number;
  @IsInt()
  @Min(1)
  rows: number;
  @IsNumber()
  @Min(1)
  seats: number;
  @IsNumber()
  @Min(0)
  price: number;
  @IsString() //  Изменить тип на string
  taken: string;
}

export class GetScheduleDto extends ScheduleDto {
  @IsString()
  id: string;
}

export class GetFilmDto {
  @IsString()
  id: string;
  @IsNumber()
  @Min(0)
  @Max(10)
  rating: number;
  @IsString()
  director: string;
  @IsString() //  Изменить тип на string
  tags: string;
  @IsString()
  title: string;
  @IsString()
  about: string;
  @IsString()
  description: string;
  @IsString()
  image: string;
  @IsString()
  cover: string;
  schedule: Schedules[]; // Use the Schedules entity
}

export class CreateScheduleDto extends ScheduleDto {}

export class CreateFilmDto {
  @IsNumber()
  @Min(0)
  @Max(10)
  readonly rating: number;
  @IsString()
  readonly director: string;
  @IsArray()
  readonly tags: string[];
  @IsString()
  readonly image: string;
  @IsString()
  readonly cover: string;
  @IsString()
  readonly title: string;
  @IsString()
  readonly about: string;
  @IsString()
  readonly description: string;
  readonly schedule: GetScheduleDto[];
}

export class FilmScheduleParams {
  @IsString()
  id: string;
}
