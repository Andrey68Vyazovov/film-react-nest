//TODO описать DTO для запросов к /films
import {
  IsFQDN,
  IsString,
  IsNumber,
  IsArray,
  ArrayNotEmpty,
  IsInt,
  Min,
  Max,
  IsMongoId,
} from 'class-validator';

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
  @IsArray()
  @ArrayNotEmpty()
  taken: string[];
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
  @IsArray()
  @ArrayNotEmpty()
  tags: string[];
  @IsString()
  title: string;
  @IsString()
  about: string;
  @IsString()
  description: string;
  @IsFQDN()
  image: string;
  @IsFQDN()
  cover: string;
  @IsArray()
  @ArrayNotEmpty()
  schedule: GetScheduleDto[];
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
  @ArrayNotEmpty()
  readonly tags: string[];
  @IsFQDN()
  readonly image: string;
  @IsFQDN()
  readonly cover: string;
  @IsString()
  readonly title: string;
  @IsString()
  readonly about: string;
  @IsString()
  readonly description: string;
  @IsArray()
  @ArrayNotEmpty()
  readonly schedule: GetScheduleDto[];
}
export class FilmScheduleParams {
  @IsMongoId()
  id: string;
}