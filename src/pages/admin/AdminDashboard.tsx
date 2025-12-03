import React, {useEffect, useState} from 'react';
import {Card} from '../../components/common/Card';
import {Loading} from '../../components/common/Loading';
import {Monitor, Ticket, TrendingUp, Users} from 'lucide-react';
import {userAPI} from '../../api/users';
import {counterAPI} from '../../api/counters';
import {ticketAPI} from '../../api/tickets';
import {Counter, TicketMetrics, User} from '../../types';

export const AdminDashboard: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [counters, setCounters] = useState<Counter[]>([]);
    const [metrics, setMetrics] = useState<TicketMetrics | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [usersData, countersData, metricsData] = await Promise.all([
                    userAPI.getAllUsers(),
                    counterAPI.getAllCounters(),
                    ticketAPI.getMetrics(),
                ]);

                setUsers(usersData);
                setCounters(countersData);
                setMetrics(metricsData);
            } catch (error) {
                console.error('Failed to fetch dashboard data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loading size="lg" text="Loading dashboard..."/>
            </div>
        );
    }

    const stats = [
        {
            title: 'Total Users',
            value: users.length.toString(),
            icon: Users,
            color: 'bg-blue-500',
        },
        {
            title: 'Active Counters',
            value: counters.filter(c => c.enabled).length.toString(),
            icon: Monitor,
            color: 'bg-green-500',
        },
        {
            title: 'Today\'s Tickets',
            value: metrics?.total_tickets || '0',
            icon: Ticket,
            color: 'bg-purple-500',
        },
        {
            title: 'Pending Queue',
            value: metrics?.pending_tickets || '0',
            icon: TrendingUp,
            color: 'bg-amber-500',
        },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
                <p className="text-gray-600">Overview of your queue management system</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <Card key={stat.title}>
                            <div className="flex items-center">
                                <div className={`${stat.color} p-3 rounded-lg`}>
                                    <Icon className="w-6 h-6 text-white"/>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                                </div>
                            </div>
                        </Card>
                    );
                })}
            </div>

            {/* Recent Activity */}
            <div className="grid gap-8 lg:grid-cols-2">
                <Card>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">User Roles</h3>
                    <div className="space-y-3">
                        {['admin', 'manager', 'agent', 'customer'].map((role) => {
                            const count = users.filter(u => u.role === role).length;
                            return (
                                <div key={role} className="flex justify-between items-center">
                                    <span className="text-sm font-medium capitalize text-gray-700">{role}s</span>
                                    <span className="text-sm text-gray-900">{count}</span>
                                </div>
                            );
                        })}
                    </div>
                </Card>

                <Card>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Counter Status</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-700">Active Counters</span>
                            <span className="text-sm text-green-600">
                {counters.filter(c => c.enabled).length}
              </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-700">Inactive Counters</span>
                            <span className="text-sm text-red-600">
                {counters.filter(c => !c.enabled).length}
              </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-700">Total Counters</span>
                            <span className="text-sm text-gray-900">{counters.length}</span>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};