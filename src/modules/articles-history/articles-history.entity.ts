import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../users/users.entity';
import { SupportedChain } from '../../constants/shared';
import { Article } from '../articles/articles.entity';

export enum SaleType {
  'TRANSFER' = 'TRANSFER',
  'PRICE_UPDATE' = 'PRICE_UPDATE',
  'SALE' = 'SALE',
  'MINT' = 'MINT',
}

@Entity('articles_history')
export class ArticleHistory {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  readonly id?: number;

  @Column({ nullable: false, type: 'int8' })
  articleId: number;

  @Column({ nullable: true, type: 'int8' })
  tokenId?: string;

  @Column({ nullable: true, type: 'int8' })
  actorId?: number;

  @Column({ nullable: false, type: 'varchar' })
  actorAddress: string;

  @Column({ nullable: false, type: 'int8' })
  receiverId?: number;

  @Column({ nullable: false, type: 'varchar' })
  receiverAddress: string;

  @Column({ nullable: false, type: 'varchar' })
  type: SaleType;

  @Column({ nullable: false, type: 'varchar' })
  action?: string;

  @Column({ nullable: true, type: 'varchar' })
  transactionHash: string;

  @Column({ nullable: true, type: 'text' })
  payload?: string;

  @Column({ nullable: true, type: 'float8' })
  currentPrice: number;

  @Column({ nullable: true, type: 'float8' })
  newPrice?: number;

  @Column({ nullable: true, type: 'varchar', default: 'bsc' })
  chain: SupportedChain;

  @ManyToOne(() => User, (creator: User) => creator.actions)
  @JoinColumn()
  actor?: User;

  @ManyToOne(() => User, (creator: User) => creator.receivedActions)
  @JoinColumn()
  receiver?: User;

  @ManyToOne(() => Article, (article: Article) => article.history)
  @JoinColumn()
  article?: Article;

  @CreateDateColumn()
  createdAt: Date | string;

  @UpdateDateColumn()
  updatedAt: Date | string;
}
