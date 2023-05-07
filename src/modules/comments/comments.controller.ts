import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './comments.dto';

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

    @Delete('/comment')
    async deleteComment(@Body() {commentId}:{commentId:number}) {
        return this.commentsService.deleteComment(commentId)
    }
}
