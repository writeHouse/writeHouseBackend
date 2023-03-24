import { EntityRepository, Repository } from 'typeorm';
import { ArticleHistory } from './articles-history.entity';

@EntityRepository(ArticleHistory)
export class ArticleHistoryRepository extends Repository<ArticleHistory> {}
