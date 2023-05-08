import { Body, Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { CommentsService } from './articles-comments.service';
import { CreateCommentDto, UpdateCommentDto } from './articles-comments.dto';

@Controller('comments')
export class CommentsController {
    constructor(
        private readonly commentsService:CommentsService
    ) {}
    @Get('/')
    async fetchAllComments(@Body() {articleId}:{articleId:number}) {
        return this.commentsService.fetchAllComments(articleId)
    }

    @Get('/comment')
    async fetchComment(@Body() {commentId}:{commentId:number}) {
        return this.commentsService.fetchComment(commentId)
    }

    @Post('/comment')
    async createComment(@Body() commentData:CreateCommentDto) {
        return this.commentsService.createComment(commentData)
    }

    @Put('/comment')
    async updateComment(@Body() commentData:UpdateCommentDto) {
        return this.commentsService.updateComment(commentData)
    }

    @Delete('/comment')
    async deleteComment(@Body() {commentId}:{commentId:number}) {
        return this.commentsService.deleteComment(commentId)
    }
}
