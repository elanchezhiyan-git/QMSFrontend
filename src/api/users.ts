import client from './client';
import {ApiResponse, User} from '../types';

export const userAPI = {
    getAllUsers: async (): Promise<User[]> => {
        const response = await client.get<ApiResponse<User[]>>('/private/users');
        return response.data.result || [];
    },

    createUser: async (data: {
        email: string;
        password: string;
        name: string;
        role: string;
        phone?: string;
    }): Promise<User> => {
        const response = await client.post<ApiResponse<User>>('/private/users', data);
        return response.data.result!;
    },

    updateUser: async (id: string, data: {
        email?: string;
        name?: string;
        role?: string;
        phone?: string;
        password?: string;
    }): Promise<User> => {
        const response = await client.patch<ApiResponse<User>>(`/private/users/${id}`, data);
        return response.data.result!;
    },

    deleteUser: async (id: string): Promise<void> => {
        await client.delete<ApiResponse>(`/private/users/${id}`);
    },
};