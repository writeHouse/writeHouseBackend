import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticlesCommentsService } from './articles-comments.service';
import { ArticlesCommentsController } from './articles-comments.controller';
import { ArticlesCommentsRepository } from './articles-comments.repository';
import { ArticleRepository } from '../articles/articles.repository';
import { UsersService } from '../users/users.service';
import { ArticlesService } from '../articles/articles.service';
import { UsersRepository } from '../users/users.repository';
import { Web3Config } from '../../config/web3/config.web3.initializer';
import { UsersFollowRepository } from '../users/users-follows.repository';
import { EventLogRepository } from '../events-logs/events-logs.repository';

@Module({
  providers: [ArticlesCommentsService, UsersService, ArticlesService, Web3Config],
  controllers: [ArticlesCommentsController],
  imports: [
    TypeOrmModule.forFeature([
      ArticlesCommentsRepository,
      ArticleRepository,
      UsersRepository,
      UsersFollowRepository,
      EventLogRepository,
    ]),
  ],
})
export class ArticlesCommentsModule {}
