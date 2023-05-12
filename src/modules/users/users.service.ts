import 'dotenv/config';
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateResult } from 'typeorm';

import { UsersRepository } from './users.repository';
import { User } from './users.entity';
import { UsersFollowRepository } from './users-follows.repository';
import { UsersFollows } from './users-follows.entity';

@Injectable()
export class UsersService {
  constructor(
    public readonly userRepository: UsersRepository,
    public readonly usersFollowRepository: UsersFollowRepository,
  ) {}

  saveNewUser(data: Partial<User>): Promise<User> {
    return this.userRepository.save({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  getAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  findOne(id: string): Promise<User> {
    return this.userRepository.findOne(id);
  }

  async findUsersPerPage({ limit = 30, page = 1 }: { limit: number; page: number }) {
    const take = limit;
    const skip = (page - 1) * take;

    const [users, totalUsers] = await this.userRepository.findAndCount({
      order: {
        id: 'DESC',
      },
      take,
      skip,
    });

    return {
      meta: {
        limit,
        currentPage: page,
        totalPages: Math.ceil(totalUsers / take),
        totalUsers,
      },
      users,
    };
  }

  async findByAddressOrUsername(walletAddress: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: [
        {
          walletAddress,
        },
        {
          username: walletAddress,
        },
      ],
    });

    return user;
  }

  async findByAddress(walletAddress: string): Promise<User> {
    return this.userRepository.findOne({
      where: {
        walletAddress,
      },
    });
  }

  async isAlreadyFollowing({ followerId, followingId }: { followerId: number; followingId: number }) {
    const follow = await this.usersFollowRepository.findOne({
      where: {
        followerId,
        followingId,
      },
    });

    return !!follow;
  }

  async userFollow(follow: UsersFollows) {
    await this.usersFollowRepository.save(follow);
    await this.userRepository.save([follow.follower, follow.following]);
  }

  async userUnFollow(follow: UsersFollows) {
    await this.usersFollowRepository.delete(follow);
    await this.userRepository.save([follow.follower, follow.following]);
  }

  findByUsername(username: string): Promise<User> {
    return this.userRepository.findOne({
      where: {
        username,
      },
    });
  }

  updateById(id: number, data: Partial<User>): Promise<UpdateResult> {
    return this.userRepository.update(id, data);
  }

  updateByAddress(walletAddress: string, data: Partial<User>): Promise<UpdateResult> {
    return this.userRepository.update({ walletAddress }, data);
  }

  increment({ id, column, by = 1 }: { id: number; column: keyof User; by?: number }): Promise<UpdateResult> {
    return this.userRepository.increment({ id }, column, by);
  }

  decrement({ id, column, by = 1 }: { id: number; column: keyof User; by?: number }): Promise<UpdateResult> {
    return this.userRepository.decrement({ id }, column, by);
  }
}
