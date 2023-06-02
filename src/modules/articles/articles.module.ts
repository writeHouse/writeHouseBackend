import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticlesService } from './articles.service';
import { ArticlesController } from './articles.controller';
import { UsersRepository } from '../users/users.repository';
import { ArticleRepository } from './articles.repository';
import { UsersService } from '../users/users.service';
import { Web3Config } from '../../config/web3/config.web3.initializer';
import { ArticlesHistoryService } from '../articles-history/articles-history.service';
import { ArticleHistoryRepository } from '../articles-history/articles-history.repository';
import { UsersFollowRepository } from '../users/users-follows.repository';
import { PublicationsRepository } from '../publications/publications.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UsersRepository,
      ArticleRepository,
      ArticleHistoryRepository,
      UsersFollowRepository,
      PublicationsRepository,
    ]),
  ],
  controllers: [ArticlesController],
  providers: [ArticlesService, UsersService, ArticlesHistoryService, Web3Config],
})
export class ArticlesModule {}
