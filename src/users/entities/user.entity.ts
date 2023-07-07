import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity()
@Unique(['username'])
export class User {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'username', nullable: false, default: false })
  username: string;

  @Column({ name: 'password', nullable: false, default: '' })
  password: string;

  @Column({ name: 'refresh_token', nullable: true, default: null })
  refreshToken: string;

  @Column({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'updated_at' })
  updatedAt: Date;
}
