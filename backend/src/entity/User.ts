import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity()
export class User {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	@Index({ unique: true })
	username: string;

	@Column({ select: false })
	pwd: string;
}
