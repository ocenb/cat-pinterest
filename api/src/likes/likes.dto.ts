import { IsString, Length } from 'class-validator';

export class AddLikeDto {
	@Length(1, 50)
	@IsString()
	cat_id: string;
}
