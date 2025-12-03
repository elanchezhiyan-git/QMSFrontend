import client from './client';
import {ApiResponse, User} from '../types';

export const authAPI = {
    login: async (email: string, password: string): Promise<User> => {
        const response = await client.post<ApiResponse<User>>('/private/auth/login', {
            email,
            password,
        });
        return response.data.result!;
    },

    logout: async (): Promise<void> => {
        await client.post<ApiResponse>('/private/auth/logout');
    },

    refresh: async (): Promise<User> => {
        const response = await client.post<ApiResponse<User>>('/private/auth/refresh');
        return response.data.result!;
    },

    getCurrentUser: async (): Promise<User> => {
        const response = await client.get<ApiResponse<User>>('/private/auth/me');
        return response.data.result!;
    },
};