import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './auth.dto';
import { Response } from 'express';
import { Public } from './decorators/public.decorator';

@Controller('user')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Public()
	@Post()
	async login(
		@Body() loginDto: LoginDto,
		@Res({ passthrough: true }) res: Response
	) {
		const { user, token } = await this.authService.login(loginDto);
		res.set('X-Auth-Token', token);
		return user;
	}
}
