import { Test, TestingModule } from '@nestjs/testing';
import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';
import {
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { GetFilmDto, FilmScheduleParams } from './dto/films.dto';

describe('FilmsController', () => {
  let controller: FilmsController;
  let service: FilmsService;

  const mockFilmsResponse: { total: number; items: GetFilmDto[] } = {
    total: 2,
    items: [
      {
        id: 'test-id-1',
        title: 'Film One',
        director: 'Director One',
        rating: 8.5,
        tags: 'action,drama',
        about: 'About Film One',
        description: 'Description of Film One',
        image: 'image1.jpg',
        cover: 'cover1.jpg',
        schedule: [],
      },
      {
        id: 'test-id-2',
        title: 'Film Two',
        director: 'Director Two',
        rating: 7.8,
        tags: 'comedy',
        about: 'About Film Two',
        description: 'Description of Film Two',
        image: 'image2.jpg',
        cover: 'cover2.jpg',
        schedule: [],
      },
    ],
  };

  const mockFilmResponse = {
    id: 'test-id-3',
    title: 'Film Three',
    director: 'Director Three',
    rating: 9.0,
    tags: 'action',
    about: 'About Film Three',
    description: 'Description of Film Three',
    image: 'image3.jpg',
    cover: 'cover3.jpg',
    schedule: [
      {
        id: 'schedule-id-1',
        daytime: '2024-06-28T10:00:53+03:00',
        hall: 1,
        rows: 10,
        seats: 20,
        price: 350,
        taken: '',
      },
    ],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilmsController],
      providers: [
        {
          provide: FilmsService,
          useValue: {
            findAll: jest.fn().mockResolvedValue(mockFilmsResponse),
            findById: jest.fn().mockResolvedValue(mockFilmResponse),
          },
        },
      ],
    }).compile();

    controller = module.get<FilmsController>(FilmsController);
    service = module.get<FilmsService>(FilmsService);
  });

  describe('.getFilms()', () => {
    it('should return all films with total count and call findAll() once', async () => {
      const result = await controller.getFilms();
      expect(result).toEqual(mockFilmsResponse);
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });

    it('should handle InternalServerErrorException when findAll() throws an error', async () => {
      jest
        .spyOn(service, 'findAll')
        .mockRejectedValue(new Error('Database error'));

      await expect(controller.getFilms()).rejects.toThrow(
        InternalServerErrorException,
      );
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('.getFilmSchedule()', () => {
    it('should return a film schedule with total count and call findById() with the correct ID', async () => {
      const params: FilmScheduleParams = { id: 'test-id-3' };
      const result = await controller.getFilmSchedule(params);

      expect(result).toEqual({
        total: mockFilmResponse.schedule.length,
        items: mockFilmResponse.schedule,
      });
      expect(service.findById).toHaveBeenCalledWith(params.id);
      expect(service.findById).toHaveBeenCalledTimes(1);
    });

    it('should handle NotFoundException when findById() throws NotFoundException', async () => {
      const params: FilmScheduleParams = { id: 'non-existing-id' };
      jest
        .spyOn(service, 'findById')
        .mockRejectedValue(new NotFoundException('Film not found'));

      await expect(controller.getFilmSchedule(params)).rejects.toThrow(
        NotFoundException,
      );
      expect(service.findById).toHaveBeenCalledWith(params.id);
      expect(service.findById).toHaveBeenCalledTimes(1);
    });

    it('should handle InternalServerErrorException when findById() throws an error', async () => {
      const params: FilmScheduleParams = { id: 'test-id-3' };
      jest
        .spyOn(service, 'findById')
        .mockRejectedValue(new Error('Database error'));

      await expect(controller.getFilmSchedule(params)).rejects.toThrow(
        InternalServerErrorException,
      );
      expect(service.findById).toHaveBeenCalledWith(params.id);
      expect(service.findById).toHaveBeenCalledTimes(1);
    });
  });
});
