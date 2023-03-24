import { EntityRepository, Repository } from 'typeorm';
import { Article } from './articles.entity';

@EntityRepository(Article)
export class ArticleRepository extends Repository<Article> {}
