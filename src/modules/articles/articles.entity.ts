import { SupportedChain } from 'src/constants/shared';
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
import { ArticleHistory } from '../articles-history/articles-history.entity';
import { Publication } from '../publications/publications.entity';
import { User } from '../users/users.entity';
import { ArticleComment } from '../articles-comments/articles-comments.entity';

@Entity('articles')
export class Article {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  readonly id: number;

  @Column({ nullable: false, type: 'varchar', unique: true })
  baseID: string;

  @Column({ nullable: true, type: 'int8', default: null })
  authorId: number;

  @Column({ nullable: true, type: 'varchar' })
  authorAddress: string;

  @Column({ nullable: true, type: 'int8', default: null })
  ownerId: number;

  @Column({ nullable: true, type: 'varchar' })
  ownerAddress: string;

  @Column({ nullable: true, type: 'varchar' })
  transactionHash: string;

  @Column({ nullable: true, type: 'int8' })
  tokenID: string;

  @Column({ nullable: false, type: 'varchar' })
  title: string;

  @Column({ nullable: true, type: 'int4' })
  priority: number;

  @Column({ nullable: false, type: 'varchar' })
  title_search: string;

  @Column({ nullable: false, type: 'varchar' })
  description: string;

  @Column({ nullable: false, type: 'varchar' })
  description_search: string;

  @Column({ nullable: true, type: 'bool', default: false })
  listed: boolean;

  @Column({ nullable: true, type: 'bool', default: false })
  listedOnChain: boolean;

  @Column({ nullable: true, type: 'varchar', default: '' })
  categories: string[];

  @Column({ nullable: true, type: 'varchar' })
  imageUrl: string;

  @Column({ nullable: true, type: 'varchar' })
  thumbnailUrl: string;

  @Column({ nullable: true, type: 'float8' })
  price: number;

  @Column({ nullable: true, type: 'varchar', default: 'active' })
  status: string;

  @Column({ nullable: true, type: 'int8', default: null })
  publicationId: number;

  @Column({ nullable: false, type: 'varchar', default: 'bsc' })
  chain: SupportedChain;

  @Column({ nullable: true, type: 'varchar' })
  country: string;

  @ManyToOne(() => Publication, (publication: Publication) => publication.articles)
  @JoinColumn()
  publication: Publication;

  @ManyToOne(() => User, (author: User) => author.articlesCreated)
  @JoinColumn()
  author: User;

  @ManyToOne(() => User, (author: User) => author.articlesOwned)
  @JoinColumn()
  owner: User;

  @OneToMany(() => ArticleHistory, (articleHistory: ArticleHistory) => articleHistory.article)
  public history: ArticleHistory[];

  @OneToMany(() => ArticleComment, (comment: ArticleComment) => comment.article)
  public comments: Comment[];

  @CreateDateColumn({
    default: () => new Date(),
  })
  createdAt: Date | string;

  @UpdateDateColumn({
    default: () => new Date(),
  })
  updatedAt: Date | string;
}
