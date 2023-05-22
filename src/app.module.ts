import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { GenreModule } from './genre/genre.module';
import { GameModule } from './game/game.module';
import { PrismaModule } from 'nestjs-prisma';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PrismaModule.forRoot(),
    AuthModule,
    UsersModule,
    GenreModule,
    GameModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
