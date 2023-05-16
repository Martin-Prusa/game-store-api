import { Injectable } from '@nestjs/common';
import { CreateGameDto, UpdateGameDto } from './game.dto';
import { PrismaService } from '../prisma.service';
import { Game, User } from '@prisma/client';

@Injectable()
export class GameService {
  constructor(private prisma: PrismaService) {}

  async create(createGameDto: CreateGameDto, user: User): Promise<any> {
    return this.prisma.game.create({
      data: {
        ...createGameDto,

        assignedBy: {
          connect: {
            id: user.id,
          },
        },

        genres: {
          create: createGameDto.genres.map((genre) => ({
            assignedBy: {
              connect: {
                id: user.id,
              },
            },
            genre: {
              connect: {
                id: genre,
              },
            },
          })),
        },
      },
    });
  }

  async findAll(userId: string): Promise<Array<Game>> {
    return this.prisma.game.findMany({
      where: {
        assignedBy: {
          id: userId,
        },
      },
    });
  }

  async update(
    id: string,
    updateGameDto: UpdateGameDto,
    user: User,
  ): Promise<Game> {
    return this.prisma.game.update({
      where: {
        id,
      },

      data: {
        assignedBy: {
          connect: {
            id: user.id,
          },
        },

        genres: {
          create: updateGameDto.genres.map((genre) => ({
            assignedBy: {
              connect: {
                id: user.id,
              },
            },
            genre: {
              connect: {
                id: genre,
              },
            },
          })),
        },
      },
    });
  }

  async findOne(id: string): Promise<Game> {
    return this.prisma.game.findUnique({
      where: {
        id,
      },
    });
  }

  async delete(id: string): Promise<Game> {
    return this.prisma.game.delete({
      where: {
        id,
      },
    });
  }
}
