import client from './client';
import {ApiResponse, Ticket} from '../types';

export const agentAPI = {
    selectCounter: async (counterId: string): Promise<void> => {
        await client.post<ApiResponse>('/private/agent/select-counter', {
            counter_id: counterId,
        });
    },

    callNextTicket: async (counterId: string): Promise<Ticket> => {
        const response = await client.post<ApiResponse<Ticket>>(`/private/agent/call-next/${counterId}`);
        return response.data.result!;
    },

    finishTicket: async (ticketId: string): Promise<void> => {
        await client.post<ApiResponse>(`/private/agent/finish/${ticketId}`);
    },

    getCurrentTicket: async (): Promise<Ticket | null> => {
        try {
            const response = await client.get<ApiResponse<Ticket>>('/private/agent/current-ticket');
            return response.data.result || null;
        } catch (error) {
            return null;
        }
    },
};