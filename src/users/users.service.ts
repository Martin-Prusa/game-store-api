import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto, LoginUserDto } from './user.dto';
import { compare, hash } from 'bcrypt';
import { PrismaService } from '../prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(userDto: CreateUserDto): Promise<any> {
    const userInDb = await this.prisma.user.findFirst({
      where: { email: userDto.email },
    });
    if (userInDb) {
      throw new HttpException('user_already_exist', HttpStatus.CONFLICT);
    }

    const hashedPassword = await hash(userDto.password, 10);

    return this.prisma.user.create({
      data: {
        email: userDto.email,
        password: hashedPassword,
      },
    });
  }

  async findByLogin({
    email,
    password,
  }: LoginUserDto): Promise<Omit<User, 'password'>> {
    const user = await this.prisma.user.findFirst({
      where: { email },
    });

    if (!user) {
      throw new HttpException('invalid_credentials', HttpStatus.UNAUTHORIZED);
    }

    const areEqual = await compare(password, user.password);

    if (!areEqual) {
      throw new HttpException('invalid_credentials', HttpStatus.UNAUTHORIZED);
    }

    const { password: pass, ...rest } = user;

    return rest;
  }

  async findByPayload({ email }: { email: string }): Promise<any> {
    const { password, ...rest } = await this.prisma.user.findFirst({
      where: { email },
    });

    return rest;
  }
}
