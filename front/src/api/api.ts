import { APP_API_URL, CAT_API_KEY, CAT_API_URL } from '@/config/config';
import axios from 'axios';

export const catApi = axios.create({
	baseURL: CAT_API_URL,
	headers: CAT_API_KEY ? { 'x-api-key': CAT_API_KEY } : {}
});

export const api = axios.create({
	baseURL: APP_API_URL
});

export const apiWithoutAuth = axios.create({
	baseURL: APP_API_URL
});

api.interceptors.request.use((config) => {
	const token = localStorage.getItem('authToken');
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

api.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response?.status === 401) {
			localStorage.removeItem('authToken');
			window.location.href = '/login';
		}
		return Promise.reject(error);
	}
);
