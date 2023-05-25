import { Injectable } from '@nestjs/common';
import { DeleteResult, UpdateResult } from 'typeorm';
import dayjs from 'dayjs';
import { isEmpty } from 'lodash';
import { ArticlesCommentsRepository } from './articles-comments.repository';
import { ArticleComment } from './articles-comments.entity';

@Injectable()
export class ArticlesCommentsService {
  constructor(public readonly articlesCommentsRepository: ArticlesCommentsRepository) {}

  async fetchAllComments({ articleId, limit, page }: { articleId: number; limit: number; page: number }) {
    const take = limit;
    const skip = (page - 1) * take;

    const [comments, totalComments] = await this.articlesCommentsRepository.findAndCount({
      where: { articleId },
      order: {
        id: 'DESC',
      },
      take,
      skip,
    });

    if (isEmpty(comments)) {
      return {
        meta: {
          limit,
          currentPage: 1,
          totalPages: 0,
          totalProposals: 0,
        },
        claims: [],
      };
    }

    return {
      meta: {
        limit,
        currentPage: page,
        totalPages: Math.ceil(totalComments / take),
        totalComments,
      },
      comments,
    };
  }

  async findById(commentId: number): Promise<ArticleComment> {
    return this.articlesCommentsRepository.findOne({
      where: {
        id: commentId,
      },
    });
  }

  delete(commentId: number): Promise<DeleteResult> {
    return this.articlesCommentsRepository.delete({ id: commentId });
  }

  save(data: Partial<ArticleComment>): Promise<ArticleComment> {
    return this.articlesCommentsRepository.save({
      ...data,
      createdAt: dayjs().format(),
      updatedAt: dayjs().format(),
    });
  }

  update(commentId: number, commentData: Partial<ArticleComment>): Promise<UpdateResult> {
    // @ts-ignore
    return this.articlesCommentsRepository.update({ id: commentId }, commentData);
  }
}
