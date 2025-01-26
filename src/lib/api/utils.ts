import type { AxiosError, AxiosResponse } from 'axios';
import { API_BASE_URL } from './constants';
import { goto } from '$app/navigation';
import axios from 'axios';

export const authenticatedFetch = axios.create({
	baseURL: API_BASE_URL,
	withCredentials: true
});

export const publicFetch = axios.create({
	baseURL: API_BASE_URL
});

authenticatedFetch.interceptors.response.use(
	(response: AxiosResponse) => response,
	(error: AxiosError) => {
		if (error.response?.status === 401) {
			goto('/login');
		}

		return Promise.reject(error);
	}
);
