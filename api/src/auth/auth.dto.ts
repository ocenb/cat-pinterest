import { IsString, Length, Matches } from 'class-validator';

export class LoginDto {
	@Length(4, 25)
	@IsString()
	@Matches(/^[a-zA-Z0-9_-]+$/, {
		message:
			'Login can only contain english letters, numbers, hyphens, and underscores'
	})
	login: string;

	@Length(5, 50)
	@IsString()
	@Matches(/^[\w!@#$%^&*?-]*$/, {
		message:
			'Password can only contain english letters, numbers, and !@#$%^&*?-_'
	})
	password: string;
}
