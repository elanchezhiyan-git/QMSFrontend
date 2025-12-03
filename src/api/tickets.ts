import client from './client';
import {ApiResponse, Ticket, TicketMetrics} from '../types';

export const ticketAPI = {
    createTicket: async (data: {
        name: string;
        phone: string;
        counter_id: string;
    }): Promise<Ticket> => {
        const response = await client.post<ApiResponse<Ticket>>('/public/ticket/create', data);
        return response.data.result!;
    },

    getTicketStatus: async (id: string): Promise<Ticket> => {
        const response = await client.get<ApiResponse<Ticket>>(`/public/ticket/status/${id}`);
        return response.data.result!;
    },

    getAllTickets: async (filters?: {
        status?: string;
        counter_id?: string;
        agent_id?: string;
        date?: string;
    }): Promise<Ticket[]> => {
        const params = new URLSearchParams();
        if (filters) {
            Object.entries(filters).forEach(([key, value]) => {
                if (value) params.append(key, value);
            });
        }
        const response = await client.get<ApiResponse<Ticket[]>>(`/private/tickets`);
        return response.data.result || [];
    },

    getMetrics: async (): Promise<TicketMetrics> => {
        const response = await client.get<ApiResponse<TicketMetrics>>('/private/tickets/metrics');
        return response.data.result!;
    },
};