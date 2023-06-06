import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { UsersService } from '../users/users.service';
import { ArticleHistoryRepository } from '../articles-history/articles-history.repository';
import { ArticleRepository } from '../articles/articles.repository';
import { ArticlesService } from '../articles/articles.service';
import { EventLogRepository } from '../events-logs/events-logs.repository';
import { PublicationsRepository } from '../publications/publications.repository';
import { PublicationsService } from '../publications/publications.service';
import { UsersFollowRepository } from '../users/users-follows.repository';
import { UsersRepository } from '../users/users.repository';

@Module({
  controllers: [FilesController],
  providers: [FilesService, UsersService, ArticlesService, PublicationsService],
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([
      UsersRepository,
      ArticleRepository,
      ArticleHistoryRepository,
      UsersFollowRepository,
      PublicationsRepository,
      EventLogRepository,
    ]),
  ],
})
export class FilesModule {}
