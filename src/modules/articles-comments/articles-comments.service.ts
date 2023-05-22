import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCommentDto, UpdateCommentDto } from './articles-comments.dto';
import { ArticlesCommentsRepository } from './articles-comments.repository';
import { ArticleComment } from './articles-comments.entity';
import { ArticleRepository } from '../articles/articles.repository';

@Injectable()
export class ArticlesCommentsService {
  constructor(
    public articlesCommentsRepository: ArticlesCommentsRepository,
    public readonly articlesRepository: ArticleRepository,
  ) {}

  async fetchAllComments(articleId: number) {
    const article = await this.articlesRepository.findOne({
      where: {
        id: articleId,
      },
    });
    if (!article) throw new BadRequestException('Article not found.');
    return await this.articlesCommentsRepository.find({ where: { articleId } });
  }

  async fetchComment(commentId: number) {
    return await this.articlesCommentsRepository.findOne({
      where: {
        id: commentId,
      },
    });
  }

  async deleteComment(commentId: number) {
    return await this.articlesCommentsRepository.delete({ id: commentId });
  }

  async saveComment(articleId: number, commentData: CreateCommentDto) {
    const article = await this.articlesRepository.findOne({
      where: {
        id: articleId,
      },
    });
    if (!article) throw new BadRequestException('Article not found.');
    const comment = new ArticleComment();
    comment.articleId = articleId;
    comment.authorAddress = commentData.authorAddress;
    comment.authorId = commentData.authorId;
    comment.body = commentData.body;
    return await this.articlesCommentsRepository.save(comment);
  }

  async updateComment(commentId: number, commentData: UpdateCommentDto) {
    return await this.articlesCommentsRepository.update({ id: commentId }, { body: commentData.body });
  }
}
