import 'dotenv/config';
import { Injectable } from '@nestjs/common';
import { UpdateResult } from 'typeorm';

import { UsersRepository } from './users.repository';
import { User } from './users.entity';

@Injectable()
export class UsersService {
  constructor(public readonly userRepository: UsersRepository) {}

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

  findOne(id: string): Promise<User> {
    return this.userRepository.findOne(id);
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
        {
          usernameLowercase: walletAddress?.toLowerCase(),
        },
      ],
    });

    return user;
  }

  findByAddress(walletAddress: string): Promise<User> {
    return this.userRepository.findOne({
      where: {
        walletAddress,
      },
    });
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
}
