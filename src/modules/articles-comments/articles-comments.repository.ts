import { EntityRepository, Repository } from 'typeorm';
import { Comment } from './articles-comments.entity';

@EntityRepository(Comment)
export class CommentRepository extends Repository<Comment> {}