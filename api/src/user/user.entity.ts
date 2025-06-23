import { Likes } from 'src/likes/likes.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class User {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	login: string;

	@Column()
	password: string;

	@OneToMany(() => Likes, (likes) => likes.user)
	likes: Likes[];
}
