import { EntityRepository, Repository } from 'typeorm';
import { UserFollow } from './users-follows.entity';

@EntityRepository(UserFollow)
export class UsersFollowRepository extends Repository<UserFollow> {}
