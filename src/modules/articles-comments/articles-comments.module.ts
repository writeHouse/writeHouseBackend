import { Module } from '@nestjs/common';
import { CommentsService } from './articles-comments.service';
import { CommentsController } from './articles-comments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentRepository } from './articles-comments.repository';

@Module({
  providers: [CommentsService],
  controllers: [CommentsController],
  imports: [TypeOrmModule.forFeature([CommentRepository])],
})
export class CommentsModule {}
