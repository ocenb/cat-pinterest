import {
	ConflictException,
	Injectable,
	Logger,
	NotFoundException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Likes } from './likes.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LikesService {
	private readonly logger = new Logger(LikesService.name);

	constructor(
		@InjectRepository(Likes)
		private readonly likesRepository: Repository<Likes>,
		private readonly configService: ConfigService
	) {}

	async getAll(userId: number) {
		this.logger.log(`Получение всех лайков для пользователя: ${userId}`);
		const likes = await this.likesRepository.find({
			where: { user_id: userId },
			select: { cat_id: true, created_at: true },
			order: { created_at: 'DESC' }
		});
		this.logger.log(
			`Найдено ${likes.length} лайков для пользователя: ${userId}`
		);
		return { data: likes };
	}

	async add(userId: number, catId: string) {
		this.logger.log(
			`Попытка добавить лайк для пользователя ${userId} на кота ${catId}`
		);
		await this.validateCat(catId);
		const likeExists = await this.likesRepository.exists({
			where: { user_id: userId, cat_id: catId }
		});
		if (likeExists) {
			this.logger.warn(
				`Лайк уже существует для пользователя ${userId} на кота ${catId}`
			);
			throw new ConflictException('Like already exists');
		}
		const like = await this.likesRepository.save({
			cat_id: catId,
			user_id: userId
		});
		this.logger.log(
			`Лайк успешно добавлен для пользователя ${userId} на кота ${catId}`
		);
		return { cat_id: like.cat_id, created_at: like.created_at };
	}

	async delete(userId: number, catId: string) {
		this.logger.log(
			`Попытка удалить лайк для пользователя ${userId} на кота ${catId}`
		);
		const exists = await this.likesRepository.exists({
			where: { user_id: userId, cat_id: catId }
		});
		if (!exists) {
			this.logger.warn(
				`Лайк не найден для пользователя ${userId} на кота ${catId}`
			);
			throw new NotFoundException('Like not found');
		}

		const result = await this.likesRepository.delete({
			user_id: userId,
			cat_id: catId
		});
		if (result.affected && result.affected > 0) {
			this.logger.log(
				`Лайк от пользователя ${userId} для ${catId} успешно удален.`
			);
		} else {
			this.logger.log(
				`Лайк от пользователя ${userId} для ${catId} не найден или уже удален.`
			);
			throw new NotFoundException('Like not found');
		}
	}

	private async validateCat(catId: string) {
		this.logger.log(`Валидация кота с ID: ${catId}`);
		let response: Response;
		try {
			response = await fetch(`https://api.thecatapi.com/v1/images/${catId}`, {
				headers: {
					'x-api-key': this.configService.getOrThrow<string>('CAT_API_KEY')
				}
			});
		} catch (error) {
			this.logger.error(`Ошибка при попытке валидировать кота с ID: ${catId}`);
			throw error;
		}
		if (!response.ok) {
			this.logger.warn(`Кот с ID ${catId} не найден во внешнем API.`);
			throw new NotFoundException('Кот не найден');
		}
		const data = await response.json();
		if (!data.id) {
			this.logger.warn(`Некорректные данные получены для кота с ID: ${catId}`);
			throw new NotFoundException('Некорректные данные кота');
		}
		this.logger.log(`Кот с ID ${catId} успешно провалидирован.`);
	}
}
