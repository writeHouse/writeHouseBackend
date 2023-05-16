import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ArticlesCommentsService } from './articles-comments.service';
import { CreateCommentDto, UpdateCommentDto } from './articles-comments.dto';
import { ArticleComment } from './articles-comments.entity';

@Controller('comments')
export class ArticlesCommentsController {
  constructor(private readonly articlesCommentsService: ArticlesCommentsService) {}
  @Get('/')
  async fetchAllComments(@Body() { articleId }: { articleId: number }) {
    return this.articlesCommentsService.fetchAllComments(articleId);
  }

  @Get('/:commentId')
  async fetchComment(@Param('commentId') commentId: number): Promise<ArticleComment> {
    const comment = await this.articlesCommentsService.fetchComment(commentId);
    if (!comment) throw new BadRequestException('Comment not found');
    return comment;
  }

  @Post('/:articleId')
  async createComment(@Param('articleId') articleId: number, @Body() commentData: CreateCommentDto) {
    return this.articlesCommentsService.saveComment(articleId, commentData);
  }

  @Put('/:commentId')
  async updateComment(@Param('commentId') commentId: number, @Body() commentData: UpdateCommentDto) {
    const comment = await this.articlesCommentsService.fetchComment(commentId);
    if (!comment) throw new BadRequestException('Comment not found');
    if (comment.authorAddress != commentData.authorAddress) {
      throw new BadRequestException(`${commentData.authorAddress} is not the author of this comment`);
    }
    return this.articlesCommentsService.updateComment(commentId, commentData);
  }

  @Delete('/:commentId')
  async deleteComment(@Param('commentId') commentId: number) {
    return this.articlesCommentsService.deleteComment(commentId);
  }
}
