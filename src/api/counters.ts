import client from './client';
import {ApiResponse, Counter} from '../types';

export const counterAPI = {
    getAllCounters: async (): Promise<Counter[]> => {
        const response = await client.get<ApiResponse<Counter[]>>('/private/counters');
        return response.data.result || [];
    },

    getPublicCounters: async (): Promise<Counter[]> => {
        const response = await client.get<ApiResponse<Counter[]>>('/public/counters');
        return response.data.result || [];
    },

    createCounter: async (data: {
        name: string;
        description?: string;
    }): Promise<Counter> => {
        const response = await client.post<ApiResponse<Counter>>('/private/counters', data);
        return response.data.result!;
    },

    updateCounter: async (id: string, data: {
        name?: string;
        description?: string;
        is_active?: boolean;
    }): Promise<Counter> => {
        const response = await client.patch<ApiResponse<Counter>>(`/private/counters/${id}`, data);
        return response.data.result!;
    },

    updateStatus: async (id: string, data: {
        name?: string;
        description?: string;
        is_active?: boolean;
    }): Promise<Counter> => {
        const response = await client.patch<ApiResponse<Counter>>(`/private/counters/updateStatus/${id}`, data);
        return response.data.result!;
    },

    deleteCounter: async (id: string): Promise<void> => {
        await client.delete<ApiResponse>(`/private/counters/${id}`);
    },
};