import React from 'react';
import {Navigate, useLocation} from 'react-router-dom';
import {useAuth} from '../context/AuthContext';
import {Loading} from '../components/common/Loading';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: string[];
    requireAuth?: boolean;
}

interface PublicRouteProps {
    children: React.ReactNode;
    redirectTo: string;

}

export const PublicRoute: React.FC<PublicRouteProps> = ({children, redirectTo = '/'}) => {

    const {user, isAuthenticated, isLoading} = useAuth();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loading size="lg" text="Checking authentication..."/>
            </div>
        );
    }

    if (isAuthenticated) {

        const rolePath: Record<string, string> = {
            admin: '/admin',
            employer: '/employer',
            applicant: '/applicant',
        }

        const roleKey = user?.role?.toLowerCase();

        return <Navigate to={roleKey && rolePath[roleKey] ? rolePath[roleKey] : redirectTo} replace/>;
    }

    return children;
};

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
                                                                  children,
                                                                  allowedRoles,
                                                                  requireAuth = true,
                                                              }) => {
    const {user, isAuthenticated, isLoading} = useAuth();
    const location = useLocation();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loading size="lg" text="Checking authentication..."/>
            </div>
        );
    }

    if (requireAuth && !isAuthenticated) {
        return <Navigate to="/auth/login" state={{from: location}} replace/>;
    }

    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        return <Navigate to="/unauthorized" replace/>;
    }

    return <>{children}</>;
};