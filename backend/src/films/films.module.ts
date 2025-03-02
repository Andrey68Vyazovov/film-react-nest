import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';
import { Film as FilmEntity } from './dto/entities/film.entity';
import { Schedules } from './dto/entities/schedule.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from '../database/database.module'; // Import DatabaseModule

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([FilmEntity, Schedules]),
    DatabaseModule,
  ],
  controllers: [FilmsController],
  providers: [FilmsService],
  exports: [FilmsService],
})
export class FilmsModule {}
