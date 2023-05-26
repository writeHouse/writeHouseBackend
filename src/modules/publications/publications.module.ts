import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PublicationsService } from './publications.service';
import { PublicationsController } from './publications.controller';
import { PublicationsRepository } from './publications.repository';
import { UsersService } from '../users/users.service';
import { UsersFollowRepository } from '../users/users-follows.repository';
import { UsersRepository } from '../users/users.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([PublicationsRepository, UsersFollowRepository, UsersRepository, PublicationsRepository]),
  ],
  controllers: [PublicationsController],
  providers: [PublicationsService, UsersService],
})
export class PublicationsModule {}
