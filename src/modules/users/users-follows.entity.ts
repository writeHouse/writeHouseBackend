import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './users.entity';

@Entity('users_follows')
export class UserFollow {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ nullable: true, type: 'int8', default: null })
  followerId: number;

  @Column({ nullable: true, type: 'int8', default: null })
  followingId: number;

  @Column({ nullable: false, type: 'text', unique: true })
  followerAddress: string;

  @Column({ nullable: false, type: 'text', unique: true })
  followingAddress: string;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date | string;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updatedAt: Date | string;

  @ManyToOne(() => User, (user: User) => user.followers)
  @JoinColumn({ name: 'followerId' })
  follower: User;

  @ManyToOne(() => User, (user: User) => user.followings)
  @JoinColumn({ name: 'followingId' })
  following: User;
}
