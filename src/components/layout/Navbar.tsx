import React from 'react';
import {Link, useLocation} from 'react-router-dom';
import {useAuth} from '../../context/AuthContext';
import {Button} from '../common/Button';
import {BarChart3, Headphones, Home, LogOut, Users} from 'lucide-react';

export const Navbar: React.FC = () => {
    const {user, logout, isAuthenticated} = useAuth();
    const location = useLocation();

    const getRoleBasedLinks = () => {
        if (!user) return [];

        switch (user.role) {
            case 'admin':
                return [
                    {to: '/admin', label: 'Dashboard', icon: BarChart3},
                    {to: '/admin/users', label: 'Users', icon: Users},
                    {to: '/admin/counters', label: 'Counters', icon: Home},
                ];
            case 'manager':
                return [
                    {to: '/manager', label: 'Dashboard', icon: BarChart3},
                    {to: '/manager/tickets', label: 'Tickets', icon: Users},
                ];
            case 'agent':
                return [
                    {to: '/agent', label: 'Agent Panel', icon: Headphones},
                ];
            default:
                return [
                    {to: '/', label: 'Home', icon: Home},
                ];
        }
    };

    const links = getRoleBasedLinks();

    return (
        <nav className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center space-x-8">
                        <Link to="/" className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-sm">QMS</span>
                            </div>
                            <span className="text-xl font-semibold text-gray-900">Queue Management</span>
                        </Link>

                        {isAuthenticated && (
                            <div className="hidden md:flex space-x-6">
                                {links.map((link) => {
                                    const Icon = link.icon;
                                    return (
                                        <Link
                                            key={link.to}
                                            to={link.to}
                                            className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                                location.pathname === link.to
                                                    ? 'text-blue-600 bg-blue-50'
                                                    : 'text-gray-700 hover:text-blue-600'
                                            }`}
                                        >
                                            <Icon className="w-4 h-4"/>
                                            <span>{link.label}</span>
                                        </Link>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    <div className="flex items-center space-x-4">
                        {isAuthenticated ? (
                            <>
                <span className="text-sm text-gray-600">
                  Welcome, <span className="font-medium">{user?.name}</span>
                </span>
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    icon={LogOut}
                                    onClick={logout}
                                >
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <Link to="/auth/login">
                                <Button size="sm">Login</Button>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};