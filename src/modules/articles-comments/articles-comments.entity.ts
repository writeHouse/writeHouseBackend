import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Article } from '../articles/articles.entity';


@Entity({name:'articles_comments'})
export class Comment {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  readonly id: number;

  @Column({type:'varchar'})
  body:string;

  @Column({ type: 'int8' })
  authorId: number;

  @Column({ type: 'varchar' })
  authorAddress: string;

  @Column({ type: 'varchar' })
  articleId: number;

  @Column({ type: 'bool', default:true })
  active: boolean;

  @ManyToOne(() => Article, (article:Article) => article.comments)
  article: Article

  @CreateDateColumn({
    default: () => new Date(),
  })
  createdAt: Date | string;

  @UpdateDateColumn({
    default: () => new Date(),
  })
  updatedAt: Date | string;
}
