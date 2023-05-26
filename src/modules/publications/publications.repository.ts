import { EntityRepository, Repository } from 'typeorm';
import { Publication } from './publications.entity';

@EntityRepository(Publication)
export class PublicationsRepository extends Repository<Publication> {}
