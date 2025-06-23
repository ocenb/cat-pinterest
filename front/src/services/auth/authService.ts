import { apiWithoutAuth } from '@/api/api';
import { User } from '../user/userTypes';
import { LoginDto } from './authTypes';

export const authService = {
	async login(dto: LoginDto) {
		return await apiWithoutAuth.post<User>('/user', dto);
	}
};
