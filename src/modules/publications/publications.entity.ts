import 'dotenv/config';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from '../users/users.entity';
import { SupportedChain } from '../../constants/shared';
import { Article } from '../articles/articles.entity';

@Entity('publications')
export class Publication {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  readonly id: number;

  @Column({ nullable: false, type: 'varchar', unique: true })
  slug: string;

  @Column({ nullable: true, type: 'int8', default: null })
  creatorId: number;

  @Column({ nullable: true, type: 'varchar' })
  creatorAddress: string;

  @Column({ nullable: false, type: 'varchar' })
  title: string;

  @Column({ nullable: false, type: 'varchar' })
  description: string;

  @Column({ nullable: true, type: 'varchar' })
  imageUrl: string;

  @Column({ nullable: true, type: 'varchar' })
  imageUrlThumbnail: string;

  @Column({ nullable: true, type: 'varchar' })
  transactionHash: string;

  @Column({ nullable: true, type: 'bool', default: true })
  active: boolean;

  @Column({ nullable: true, type: 'int4', default: 1 })
  priority: number;

  @Column({ nullable: true, type: 'varchar', default: SupportedChain.BINANCE })
  chain: SupportedChain;

  @Column({ nullable: true, type: 'varchar' })
  title_search: string;

  @Column({ nullable: true, type: 'varchar' })
  description_search: string;

  @Column({ nullable: true, type: "varchar" })
  country: string;

  @ManyToOne(() => User, (creator: User) => creator.articlesCreated)
  @JoinColumn()
  creator: Partial<User>;

  @OneToMany(() => Article, (article: Article) => article.publication)
  public articles: Article[];

  @CreateDateColumn({
    default: () => new Date(),
  })
  createdAt: Date | string;

  @UpdateDateColumn({
    default: () => new Date(),
  })
  updatedAt: Date | string;
}
