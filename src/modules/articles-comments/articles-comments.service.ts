import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCommentDto, UpdateCommentDto } from './articles-comments.dto';
import { CommentRepository } from './articles-comments.repository';
import { Comment } from './articles-comments.entity';

@Injectable()
export class CommentsService {

    constructor(
        public commentRepository:CommentRepository
    ) {}

    async fetchAllComments(articleId:number) {
        try {
          return await this.commentRepository.find({articleId}) 
        } catch(err) {
            throw new BadRequestException(err.message)
        }
        
    }

    async fetchComment(commentId:number) {
        try {
           return await this.commentRepository.findOneOrFail({id:commentId}) 
        } catch(err) {
            throw new BadRequestException(err.message)
        }
        
    }

    async deleteComment(commentId:number) {
        try {
          return await this.commentRepository.delete({id:commentId})  
        } catch(err) {
            throw new BadRequestException(err.message)
        }
        
    }

    async createComment(commentData:CreateCommentDto) {
        try {
            const comment = new Comment()
            comment.articleId = commentData.articleId
            comment.authorAddress = commentData.authorAddress 
            comment.authorId = commentData.authorId
            comment.body = commentData.body
            return await this.commentRepository.save(comment)
        } catch(err) {
            throw new BadRequestException(err.message)
        }
        
    }

    async updateComment(commentData:UpdateCommentDto) {
        try {
            const comment = await this.commentRepository.findOneOrFail({id:commentData.id})
            if(comment.authorAddress != commentData.authorAddress) {
                throw new BadRequestException({author:commentData.authorAddress},'Not the author of this comment')
            }
            return await this.commentRepository.update({id:commentData.id}, {body:commentData.body})
        } catch(err) {
            throw new BadRequestException(err.message)
        }
        
    }

}
