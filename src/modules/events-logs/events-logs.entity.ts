import { Entity, Column, PrimaryGeneratedColumn, UpdateDateColumn, CreateDateColumn } from 'typeorm';
import { SupportedChain } from '../../constants/shared';

@Entity('events_logs')
export class EventLog {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  readonly id: number;

  @Column({ nullable: false, type: 'int8' })
  userId: number;

  @Column({ nullable: false, type: 'int8' })
  articleId: number;

  @Column({ nullable: false, type: 'int8' })
  publicationId: number;

  @Column({ nullable: false, type: 'varchar' })
  type: string;

  @Column({ nullable: true, type: 'varchar' })
  transactionHash: string;

  @Column({ nullable: true, type: 'varchar' })
  triggerAddress: string;

  @Column({ nullable: true, type: 'varchar' })
  data: string;

  @Column({ nullable: true, type: 'varchar', select: false })
  country: string;

  @Column({ nullable: false, type: 'varchar', default: 'bsc' })
  chain: SupportedChain;

  @CreateDateColumn()
  createdAt: Date | string;

  @UpdateDateColumn()
  updatedAt: Date | string;
}
