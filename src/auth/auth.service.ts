import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto, LoginUserDto } from '../users/user.dto';
import { PrismaService } from '../prisma.service';
import { User } from '@prisma/client';
import { JwtPayload } from './jwt.strategy';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async register(userDto: CreateUserDto): Promise<RegistrationStatus> {
    let status: RegistrationStatus = {
      success: true,
      message: 'ACCOUNT_CREATE_SUCCESS',
    };

    try {
      const userData = await this.usersService.create(userDto);
      delete userData.password;

      status.data = userData;
    } catch (err) {
      status = {
        success: false,
        message: err,
      };
    }
    return status;
  }

  async login(loginUserDto: LoginUserDto): Promise<any> {
    const user = await this.usersService.findByLogin(loginUserDto);

    const token = this._createToken(user);

    return {
      ...token,
      data: user,
    };
  }

  private _createToken(user: Omit<User, 'password'>): any {
    const jwtUser: JwtPayload = { ...user };
    const Authorization = this.jwtService.sign(jwtUser);
    return {
      expiresIn: process.env.EXPIRESIN,
      Authorization,
    };
  }

  async validateUser(payload: JwtPayload): Promise<User> {
    const user = await this.usersService.findByPayload(payload);
    if (!user) {
      throw new HttpException('INVALID_TOKEN', HttpStatus.UNAUTHORIZED);
    }
    return user;
  }
}

export interface RegistrationStatus {
  success: boolean;
  message: string;
  data?: User;
}
