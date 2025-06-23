import { User } from 'src/user/user.entity';
import {
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryColumn
} from 'typeorm';

@Entity()
export class Likes {
	@PrimaryColumn()
	cat_id: string;

	@PrimaryColumn()
	user_id: number;

	@CreateDateColumn()
	created_at: Date;

	@ManyToOne(() => User, (user) => user.likes)
	@JoinColumn({ name: 'user_id' })
	user: User;
}
