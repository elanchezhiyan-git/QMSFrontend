import React, {createContext, useContext, useEffect, useState} from 'react';
import {AuthContextType, User} from '../types';
import {authAPI} from '../api/auth';
import toast from 'react-hot-toast';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({children}) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const login = async (email: string, password: string): Promise<void> => {
        try {
            const userData = await authAPI.login(email, password);
            setUser(userData);
            toast.success('Login successful!');
        } catch (error: any) {
            const message = error.response?.data?.message || 'Login failed';
            toast.error(message);
            throw error;
        }
    };

    const logout = async (): Promise<void> => {
        try {
            await authAPI.logout();
            window.location.reload();
        } catch (error) {
            // Ignore logout errors
        } finally {
            setUser(null);
            toast.success('Logged out successfully');
        }
    };

    const refreshToken = async (): Promise<void> => {
        try {
            const userData = await authAPI.refresh();
            setUser(userData);
        } catch (error) {
            setUser(null);
        }
    };

    const setCounter = async (id: string): Promise<void> => {
        setUser(prev => prev ? {...prev, counter_id: id} : prev);
    }

    // Check authentication status on mount
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const userData = await authAPI.getCurrentUser();
                setUser(userData);
            } catch (error) {
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };

        if (window.location.pathname.includes("/auth/login")) {
            setIsLoading(false);
            return;
        }

        checkAuth();
    }, []);

    const value: AuthContextType = {
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        refreshToken,
        setCounter,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};