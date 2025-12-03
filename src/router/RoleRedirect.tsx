import React from 'react';
import {Navigate} from 'react-router-dom';
import {useAuth} from '../context/AuthContext';

export const RoleRedirect: React.FC = () => {
    const {user} = useAuth();

    if (!user) {
        return <Navigate to="/auth/login" replace/>;
    }

    switch (user.role) {
        case 'admin':
            return <Navigate to="/admin" replace/>;
        case 'manager':
            return <Navigate to="/manager" replace/>;
        case 'agent':
            return <Navigate to="/agent" replace/>;
        case 'customer':
        default:
            return <Navigate to="/" replace/>;
    }
};