import { EntityRepository, Repository } from 'typeorm';
import { UsersFollows } from './users-follows.entity';

@EntityRepository(UsersFollows)
export class UsersFollowRepository extends Repository<UsersFollows> {}
