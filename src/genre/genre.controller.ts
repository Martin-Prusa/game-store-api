import {
  Controller,
  Post,
  Body,
  Get,
  Delete,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GenreService } from './genre.service';
import { CreateGenreDto } from './genre.dto';
import { JwtAuthGuard } from '../auth/jwt.auth.gaurd';

@ApiTags('genres')
@Controller('genres')
export class GenreController {
  constructor(private readonly genreService: GenreService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createGenreDto: CreateGenreDto) {
    return this.genreService.create(createGenreDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.genreService.findAll();
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  delete(@Param('id') id: string) {
    return this.genreService.delete(id);
  }
}
