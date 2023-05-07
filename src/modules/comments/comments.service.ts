import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCommentDto } from './comments.dto';
import { CommentRepository } from './comments.repository';
import { Comment } from './comments.entity';

@Injectable()
export class CommentsService {

    constructor(
        public commentRepository:CommentRepository
    ) {}

    async fetchAllComments(articleId:number) {
        try {
          return await this.commentRepository.find({id:articleId}) 
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

    /*****possibly adding an update comment section */


}
