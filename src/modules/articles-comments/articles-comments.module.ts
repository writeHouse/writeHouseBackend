import { Module } from '@nestjs/common';
import { ArticlesCommentsService } from './articles-comments.service';
import { ArticlesCommentsController } from './articles-comments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticlesCommentsRepository } from './articles-comments.repository';
import { ArticleRepository } from '../articles/articles.repository';

@Module({
  providers: [ArticlesCommentsService],
  controllers: [ArticlesCommentsController],
  imports: [TypeOrmModule.forFeature([ArticlesCommentsRepository, ArticleRepository])],
})
export class ArticlesCommentsModule {}
