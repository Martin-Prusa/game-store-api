import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  MaxLength,
  IsArray,
  IsDateString,
} from 'class-validator';

export class CreateGameDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  @MaxLength(1000)
  description?: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  sale?: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  publisher?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  developer?: string;

  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  releaseDate?: Date;

  @ApiProperty({ required: false })
  @IsArray()
  genres: string[];
}

export class UpdateGameDto extends PartialType(CreateGameDto) {
  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  id?: number;
}
