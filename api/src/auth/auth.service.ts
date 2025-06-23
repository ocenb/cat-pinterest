import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { LoginDto } from './auth.dto';
import { hash, compare } from 'bcrypt';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { Payload } from './models/payload.model';

@Injectable()
export class AuthService {
	private readonly logger = new Logger(AuthService.name);

	constructor(
		private readonly userService: UserService,
		private readonly jwtService: JwtService
	) {}

	async login(loginDto: LoginDto) {
		this.logger.log(`Попытка входа для пользователя: ${loginDto.login}`);
		let user = await this.userService.getByLogin(loginDto.login);
		if (user) {
			const isPassCorrect = await compare(loginDto.password, user.password);
			if (!isPassCorrect) {
				this.logger.warn(
					`Неправильный пароль для пользователя: ${loginDto.login}`
				);
				throw new UnauthorizedException('Wrong password');
			}
			this.logger.log(`Пользователь ${user.login} успешно вошел в систему.`);
		} else {
			this.logger.log(`Создание нового пользователя: ${loginDto.login}`);
			const hashedPassword = await hash(loginDto.password, 10);
			user = await this.userService.create(loginDto.login, hashedPassword);
			this.logger.log(`Новый пользователь ${user.login} успешно создан.`);
		}
		const token = this.generateToken(user.id);

		return { user: { login: user.login, id: user.id }, token };
	}

	private generateToken(userId: number) {
		const payload: Payload = { userId };

		return this.jwtService.sign(payload, {
			expiresIn: '10d'
		});
	}
}
