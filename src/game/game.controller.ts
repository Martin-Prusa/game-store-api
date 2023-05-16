import {
  Controller,
  Post,
  Body,
  Get,
  Put,
  Delete,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GameService } from './game.service';
import { CreateGameDto, UpdateGameDto } from './game.dto';
import { JwtAuthGuard } from '../auth/jwt.auth.gaurd';

import { UseUser } from '../users/user.decorator';
import type { User } from '@prisma/client';

@ApiTags('games')
@Controller('games')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createGameDto: CreateGameDto, @UseUser() user: User) {
    return this.gameService.create(createGameDto, user);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@UseUser() user: User) {
    return this.gameService.findAll(user.id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.gameService.findOne(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateGameDto: UpdateGameDto,
    @UseUser() user: User,
  ) {
    return this.gameService.update(id, updateGameDto, user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  delete(@Param('id') id: string) {
    return this.gameService.delete(id);
  }
}
