import { Injectable } from '@nestjs/common';
import { CreateGenreDto } from './genre.dto';
import { PrismaService } from '../prisma.service';
import { Genre } from '@prisma/client';

@Injectable()
export class GenreService {
  constructor(private prisma: PrismaService) {}

  async create(createGenreDto: CreateGenreDto): Promise<Genre> {
    return this.prisma.genre.create({
      data: {
        ...createGenreDto,
      },
    });
  }

  async findAll(): Promise<Array<Genre>> {
    return this.prisma.genre.findMany();
  }

  async delete(id: string): Promise<Genre> {
    return this.prisma.genre.delete({
      where: {
        id,
      },
    });
  }
}
