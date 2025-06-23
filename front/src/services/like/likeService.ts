import { api } from '@/api/api';
import { AddLikeDto, Like, LikesList } from './likeTypes';

export const likeService = {
	async getAll() {
		return await api.get<LikesList>('/likes');
	},
	async add(dto: AddLikeDto) {
		return await api.post<Like>('/likes', dto);
	},
	async delete(cat_id: string) {
		return await api.delete(`/likes/${cat_id}`);
	}
};
