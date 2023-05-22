import { Injectable } from '@nestjs/common';
import { AddRatingDto, CreateGameDto, UpdateGameDto } from './game.dto';
import { PrismaService } from '../prisma.service';
import { Game, Rating, User } from '@prisma/client';

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
      include: { genres: { include: { genre: true } }, ratings: true },
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
    const currentGame = await this.prisma.game.findUnique({
      where: { id },
      include: { genres: true },
    });

    if (!currentGame) {
      throw new Error('Game not found');
    }

    const currentGenreIds = currentGame.genres.map((g) => g.genreId);
    const newGenreIds = updateGameDto.genres || [];

    const connect = newGenreIds.filter((id) => !currentGenreIds.includes(id));
    const disconnect = currentGenreIds.filter(
      (id) => !newGenreIds.includes(id),
    );

    return this.prisma.game.update({
      where: {
        id,
      },

      data: {
        ...updateGameDto,

        genres: {
          delete:
            disconnect.length > 0
              ? disconnect.map((genreId) => ({
                  gameId_genreId: {
                    gameId: id,
                    genreId,
                  },
                }))
              : undefined,

          connectOrCreate: connect.map((genreId) => ({
            where: {
              gameId_genreId: {
                gameId: id,
                genreId,
              },
            },
            create: {
              assignedBy: {
                connect: {
                  id: user.id,
                },
              },
              genre: {
                connect: {
                  id: genreId,
                },
              },
            },
          })),
        },
      },

      include: { genres: { include: { genre: true } }, ratings: true },
    });
  }

  async findOne(id: string): Promise<Game> {
    return this.prisma.game.findUnique({
      where: {
        id,
      },
      include: { genres: { include: { genre: true } }, ratings: true },
    });
  }

  async delete(id: string): Promise<Game> {
    return this.prisma.game.delete({
      where: {
        id,
      },
    });
  }

  async addRating(
    id: string,
    rating: AddRatingDto,
    user: User,
  ): Promise<Rating> {
    return this.prisma.rating.create({
      data: {
        ...rating,
        game: {
          connect: {
            id: id,
          },
        },
        assignedBy: {
          connect: {
            id: user.id,
          },
        },
      },
    });
  }
}
