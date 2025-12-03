import React, {useEffect, useState} from 'react';
import {Card} from '../../components/common/Card';
import {Loading} from '../../components/common/Loading';
import {TicketMetrics} from '../../types';
import {ticketAPI} from '../../api/tickets';
import {CheckCircle, Clock, TrendingUp, Users} from 'lucide-react';

export const ManagerDashboard: React.FC = () => {
    const [metrics, setMetrics] = useState<TicketMetrics | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                const data = await ticketAPI.getMetrics();
                setMetrics(data);
            } catch (error) {
                console.error('Failed to fetch metrics:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMetrics();
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
            title: 'Total Tickets Today',
            value: metrics?.total_tickets || '0',
            icon: Users,
            color: 'bg-blue-500',
            textColor: 'text-blue-600',
        },
        {
            title: 'Tickets Served',
            value: metrics?.served_tickets || '0',
            icon: CheckCircle,
            color: 'bg-green-500',
            textColor: 'text-green-600',
        },
        {
            title: 'Pending in Queue',
            value: metrics?.pending_tickets|| '0',
            icon: Clock,
            color: 'bg-amber-500',
            textColor: 'text-amber-600',
        },
        {
            title: 'Avg Wait Time',
            value: metrics ? `${Math.round(metrics.average_wait_time)}m` : '0m',
            icon: TrendingUp,
            color: 'bg-purple-500',
            textColor: 'text-purple-600',
        },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Manager Dashboard</h1>
                <p className="text-gray-600">Monitor queue performance and system metrics</p>
            </div>

            {/* Metrics Grid */}
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
                                    <p className={`text-3xl font-bold ${stat.textColor}`}>{stat.value}</p>
                                </div>
                            </div>
                        </Card>
                    );
                })}
            </div>

            {/* Performance Overview */}
            {metrics && (
                <div className="grid gap-8 lg:grid-cols-2">
                    <Card>
                        <h3 className="text-lg font-semibold text-gray-900 mb-6">Queue Performance</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-gray-600">Service Efficiency</span>
                                <span className="text-sm font-bold text-green-600">
                  {metrics.total_tickets > 0
                      ? Math.round((metrics.served_tickets / metrics.total_tickets) * 100)
                      : 0
                  }%
                </span>
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-gray-600">Queue Load</span>
                                <span className={`text-sm font-bold ${
                                    metrics.pending_tickets > 10 ? 'text-red-600' :
                                        metrics.pending_tickets > 5 ? 'text-amber-600' : 'text-green-600'
                                }`}>
                  {metrics.pending_tickets > 10 ? 'High' :
                      metrics.pending_tickets > 5 ? 'Medium' : 'Low'}
                </span>
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-gray-600">Response Time</span>
                                <span className={`text-sm font-bold ${
                                    metrics.average_wait_time > 30 ? 'text-red-600' :
                                        metrics.average_wait_time > 15 ? 'text-amber-600' : 'text-green-600'
                                }`}>
                  {metrics.average_wait_time > 30 ? 'Slow' :
                      metrics.average_wait_time > 15 ? 'Fair' : 'Good'}
                </span>
                            </div>
                        </div>
                    </Card>

                    <Card>
                        <h3 className="text-lg font-semibold text-gray-900 mb-6">Today's Summary</h3>
                        <div className="space-y-4">
                            <div className="text-center p-4 bg-blue-50 rounded-lg">
                                <p className="text-2xl font-bold text-blue-600">{metrics.total_tickets}</p>
                                <p className="text-sm text-blue-700">Total Tickets Created</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="text-center p-3 bg-green-50 rounded-lg">
                                    <p className="text-xl font-bold text-green-600">{metrics.served_tickets}</p>
                                    <p className="text-xs text-green-700">Completed</p>
                                </div>
                                <div className="text-center p-3 bg-amber-50 rounded-lg">
                                    <p className="text-xl font-bold text-amber-600">{metrics.pending_tickets}</p>
                                    <p className="text-xs text-amber-700">Pending</p>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
};