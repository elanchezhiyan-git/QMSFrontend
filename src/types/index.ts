export interface User {
    id: string;
    email: string;
    name: string;
    role: 'customer' | 'agent' | 'manager' | 'admin';
    phone?: string;
    counter_id?: string;
    created_at: string;
    updated_at: string;
}

export interface Counter {
    id: string;
    name: string;
    description?: string;
    enabled: boolean;
    created_at: string;
    updated_at: string;
}

export interface Ticket {
    id: string;
    customer_name: string;
    customer_phone: string;
    counter_id: string;
    counter?: Counter;
    agent_id?: string;
    agent?: User;
    status: 'pending' | 'called' | 'finished';
    created_at: string;
    called_at?: string;
    finished_at?: string;
}

export interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    result?: T;
}

export interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    refreshToken: () => Promise<void>;
    setCounter: (id: number | string) => Promise<void>;
}

export interface TicketMetrics {
    total_tickets: number;
    pending_tickets: number;
    served_tickets: number;
    average_wait_time: number;
}