import { messages, regex } from '@/config/config';
import { z } from 'zod';

export const LoginSchema = z.object({
	login: z
		.string()
		.min(4, messages.min('Login', 4))
		.max(25, messages.max('Login', 25))
		.regex(regex.login, messages.loginRegex),
	password: z
		.string()
		.min(5, messages.min('Password', 5))
		.max(50, messages.max('Password', 50))
		.regex(regex.password, messages.passwordRegex)
});

export type LoginDto = z.infer<typeof LoginSchema>;
