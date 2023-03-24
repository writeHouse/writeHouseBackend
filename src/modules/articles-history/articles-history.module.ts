import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleHistoryRepository } from './articles-history.repository';
import { ArticlesHistoryService } from './articles-history.service';

@Module({
  imports: [TypeOrmModule.forFeature([ArticleHistoryRepository])],
  providers: [ArticlesHistoryService],
})
export class ArticlesHistoryModule {}
