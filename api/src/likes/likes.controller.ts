import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { UserData } from 'src/auth/decorators/user.decorator';
import { LikesService } from './likes.service';
import { AddLikeDto } from './likes.dto';

@Controller('likes')
export class LikesController {
	constructor(private readonly likesService: LikesService) {}

	@Get()
	async getAll(@UserData('userId') userId: number) {
		return await this.likesService.getAll(userId);
	}

	@Post()
	async add(
		@UserData('userId') userId: number,
		@Body() addLikeDto: AddLikeDto
	) {
		return await this.likesService.add(userId, addLikeDto.cat_id);
	}

	@Delete(':cat_id')
	async delete(
		@UserData('userId') userId: number,
		@Param('cat_id') cat_id: string
	) {
		await this.likesService.delete(userId, cat_id);
	}
}
