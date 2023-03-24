import { Injectable } from '@nestjs/common';
import { IsNull, Not } from 'typeorm';
import { ArticleHistoryRepository } from './articles-history.repository';
import { ArticleHistory } from './articles-history.entity';

@Injectable()
export class ArticlesHistoryService {
  constructor(public readonly articleHistoryRepository: ArticleHistoryRepository) {}

  findByTransactionHash(transactionHash: string): Promise<ArticleHistory> {
    return this.articleHistoryRepository.findOne({
      where: {
        transactionHash,
      },
    });
  }

  findAllByTokenID(tokenId: string): Promise<ArticleHistory[]> {
    return this.articleHistoryRepository.find({
      relations: ['actor'],
      order: {
        id: 'DESC',
      },
      where: {
        tokenId,
        transactionHash: Not(IsNull()),
      },
    });
  }

  findAllByArticleId(articleId: number): Promise<ArticleHistory[]> {
    return this.articleHistoryRepository.find({
      relations: ['actor', 'receiver'],
      order: {
        createdAt: 'DESC',
      },
      where: {
        articleId,
        transactionHash: Not(IsNull()),
      },
    });
  }

  async save(data: Partial<ArticleHistory>): Promise<ArticleHistory> {
    return this.articleHistoryRepository.save({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
}
