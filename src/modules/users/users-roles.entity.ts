import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './users.entity';
import { Role } from './roles.entity';

@Entity('users_roles')
export class UserRole {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ nullable: false, type: 'int8' })
  userId: number;

  @Column({ nullable: false, type: 'int8' })
  roleId: number;

  @ManyToOne(() => Role, (role: Role) => role.userRoles)
  @JoinColumn()
  role: Role;

  @ManyToOne(() => User, (user: User) => user.userRoles)
  @JoinColumn()
  user: User;

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
