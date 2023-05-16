import { EntityRepository, Repository } from 'typeorm';
import { ArticleComment } from './articles-comments.entity';

@EntityRepository(ArticleComment)
export class ArticlesCommentsRepository extends Repository<ArticleComment> {}
