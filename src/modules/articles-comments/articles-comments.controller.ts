import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { ArticlesCommentsService } from './articles-comments.service';
import { CreateCommentDto, UpdateCommentDto } from './articles-comments.dto';
import { ArticleComment } from './articles-comments.entity';
import { ArticlesService } from '../articles/articles.service';
import { UsersService } from '../users/users.service';

@Controller('comments')
export class ArticlesCommentsController {
  constructor(
    private readonly articlesCommentsService: ArticlesCommentsService,
    private readonly articlesService: ArticlesService,
    private readonly userService: UsersService,
  ) {}
  @Get('/:articleId/articles-comments')
  async fetchAllComments(
    @Param('articleId') articleId: number,
    @Query() { limit = 30, page = 1 }: { limit: number; page: number },
  ) {
    return this.articlesCommentsService.fetchAllComments({ articleId, limit, page });
  }

  @Get('/:commentId')
  async fetchComment(@Param('commentId') commentId: number, @Req() req) {
    const { polyglot } = req;

    const comment = await this.articlesCommentsService.findById(commentId);
    if (!comment) {
      throw new NotFoundException(polyglot.t('Comment not found'));
    }

    return comment;
  }

  @Post('/')
  async createComment(@Body() commentData: CreateCommentDto, @Req() req) {
    const { polyglot } = req;

    const user = await this.userService.findByAddress(commentData.walletAddress);
    if (user) {
      throw new NotFoundException(polyglot.t('User not found'));
    }

    const article = await this.articlesService.findByBaseId(commentData.baseID);
    if (article) {
      throw new NotFoundException(polyglot.t('Article not found'));
    }

    const comment = await this.articlesCommentsService.save({
      articleId: article.id,
      body: commentData.body,
      authorAddress: user.walletAddress,
      authorId: user.id,
    });

    return {
      message: `Comment saved successfully`,
      comment,
    };
  }

  @Put('/:commentId')
  async updateComment(@Param('commentId') commentId: number, @Body() commentData: UpdateCommentDto, @Req() req) {
    const { polyglot } = req;

    const comment = await this.articlesCommentsService.findById(commentId);
    if (!comment) {
      throw new NotFoundException(polyglot.t('Comment not found'));
    }
    if (comment.authorAddress !== commentData.walletAddress) {
      throw new BadRequestException(`${commentData.walletAddress} is not the author of this comment`);
    }
    await this.articlesCommentsService.update(commentId, commentData);

    return {
      message: `Comment updated successfully`,
      comment: { ...comment, body: comment.body },
    };
  }

  @Delete('/:commentId')
  async deleteComment(@Param('commentId') commentId: number, @Req() req) {
    const { polyglot } = req;

    const comment = await this.articlesCommentsService.findById(commentId);
    if (!comment) {
      throw new NotFoundException(polyglot.t('Comment not found'));
    }
    await this.articlesCommentsService.delete(commentId);

    return {
      message: `Comment deleted successfully`,
    };
  }
}
