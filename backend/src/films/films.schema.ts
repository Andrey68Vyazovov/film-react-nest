import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import {
  IsString,
  IsNumber,
  IsArray,
  IsInt,
  Min,
  Max,
  ArrayNotEmpty,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

@Schema()
export class Schedule {
  @Prop({ required: true })
  @IsString()
  id: string;

  @Prop({ required: true })
  @IsString()
  daytime: string;

  @Prop({ required: true })
  @IsInt()
  @Min(1)
  hall: number;

  @Prop({ required: true })
  @IsInt()
  @Min(1)
  rows: number;

  @Prop({ required: true })
  @IsInt()
  @Min(1)
  seats: number;

  @Prop({ required: true })
  @IsNumber()
  @Min(0)
  price: number;

  @Prop({ type: [String], default: [] })
  @IsArray()
  @ArrayNotEmpty()
  taken: string[];
}

export const ScheduleSchema = SchemaFactory.createForClass(Schedule);

@Schema()
export class Film extends Document {
  @Prop({ required: true, unique: true })
  @IsString()
  id: string;

  @Prop({ required: true })
  @IsString()
  title: string;

  @Prop({ required: true })
  @Min(0)
  @Max(10)
  rating: number;

  @Prop({ required: true })
  @IsString()
  director: string;

  @Prop({ type: [String], default: [] })
  @IsArray()
  tags: string[];

  @Prop({ required: true })
  @IsString()
  image: string;

  @Prop({ required: true })
  @IsString()
  cover: string;

  @Prop({ required: true })
  @IsString()
  about: string;

  @Prop({ required: true })
  @IsString()
  description: string;

  @Prop({ type: [ScheduleSchema], default: [] })
  @ValidateNested({ each: true })
  @Type(() => Schedule)
  schedule: Schedule[];
}

export const FilmSchema = SchemaFactory.createForClass(Film);
