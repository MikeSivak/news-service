import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class News {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'title', nullable: false, default: false })
  title: string;

  @Column({ name: 'content', nullable: false, default: false })
  content: string;

  @Column({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne((type) => User)
  @JoinColumn({ name: 'created_by' })
  createdBy: number;
}
