import { Entity, Column, PrimaryGeneratedColumn, UpdateDateColumn, CreateDateColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ nullable: false, type: 'text', unique: true })
  walletAddress: string;

  @Column({ nullable: true, type: 'text' })
  username: string;

  @Column({ nullable: true, type: 'varchar' })
  usernameLowercase: string;

  @Column({ nullable: true, type: 'varchar' })
  email: string;

  @Column({ nullable: true, type: 'varchar' })
  fullName: string;

  @Column({ nullable: true, type: 'varchar' })
  userAvatarUrl: string;

  @Column({ nullable: true, type: 'varchar' })
  userAvatarUrlThumbnail: string;

  @Column({ nullable: true, type: 'varchar' })
  userAvatarUrlCompressed: string;

  @Column({ nullable: true, type: 'varchar' })
  coverUrl: string;

  @Column({ nullable: true, type: 'varchar' })
  coverThumbnailUrl: string;

  @Column({ nullable: true, type: 'varchar' })
  userBio: string;

  @Column({ nullable: true, type: 'boolean', default: false })
  hasAcceptedTerms: boolean;

  @Column({ nullable: true, type: 'boolean', default: false })
  banned: boolean;

  @Column({ nullable: true, type: 'varchar', default: 'active' })
  status: string;

  @Column({ nullable: false, type: 'boolean', default: false })
  verified: boolean;

  @Column({ nullable: false, type: 'int4', default: 0 })
  salesCount: number;

  @Column({ nullable: false, type: 'float8', default: 0.0 })
  salesTotalAmount: number;

  @Column({ nullable: false, type: 'int4', default: 0 })
  buysCount: number;

  @Column({ nullable: false, type: 'float8', default: 0.0 })
  buysTotalAmount: number;

  @Column({ nullable: false, type: 'bool', default: false })
  notAllowedToPost: boolean;

  @Column({ nullable: true, type: 'varchar', default: '' })
  socialUrl: string;

  @Column({ nullable: true, type: 'varchar' })
  twitterUrl: string;

  @Column({ nullable: true, type: 'varchar' })
  linkedinUrl: string;

  @Column({ nullable: false, type: 'bool', default: false })
  canCreatePublication: boolean;

  @Column({ nullable: true, type: 'bool', default: true })
  leaderboard: boolean;

  @Column({ nullable: true, type: 'int4', default: 0 })
  followerCount: number;

  @Column({ nullable: true, type: 'int4', default: 0 })
  followingCount: number;

  @Column({ nullable: true, type: 'int4', default: 0 })
  CreatedCount: number;

  @Column({ nullable: true, type: 'varchar' })
  username_search: string;

  @Column({ nullable: true, type: 'varchar' })
  fullName_search: string;

  @Column({ nullable: true, type: 'varchar' })
  keywords_search: string;

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
}
