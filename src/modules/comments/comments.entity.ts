import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';


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

  @CreateDateColumn({
    default: () => new Date(),
  })
  createdAt: Date | string;

  @UpdateDateColumn({
    default: () => new Date(),
  })
  updatedAt: Date | string;
}
