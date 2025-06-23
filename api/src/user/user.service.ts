import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
	private readonly logger = new Logger(UserService.name);

	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>
	) {}

	async getByLogin(login: string) {
		this.logger.log(`Поиск пользователя по логину: ${login}`);
		const user = await this.userRepository.findOne({ where: { login } });
		if (user) {
			this.logger.log(`Пользователь найден: ${login}`);
		} else {
			this.logger.log(`Пользователь не найден: ${login}`);
		}
		return user;
	}

	async create(login: string, password: string) {
		this.logger.log(`Создание нового пользователя с логином: ${login}`);
		const newUser = await this.userRepository.save({ login, password });
		this.logger.log(`Пользователь ${login} успешно создан с ID: ${newUser.id}`);
		return newUser;
	}
}
