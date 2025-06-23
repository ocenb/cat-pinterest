import { catApi } from '@/api/api';
import { CatImage } from './catTypes';

export const catService = {
	async getMany(page: number, limit: number = 15) {
		const response = await catApi.get<CatImage[]>(`/images/search`, {
			params: {
				limit,
				page,
				order: 'DESC'
			}
		});
		return response.data;
	},
	async getOneById(id: string) {
		return await catApi.get(`/images/${id}`);
	}
};
