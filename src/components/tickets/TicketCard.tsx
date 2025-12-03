import React from 'react';
import {Ticket} from '../../types';
import {Card} from '../common/Card';
import {CheckCircle, Clock, Hash, User} from 'lucide-react';

interface TicketCardProps {
    ticket: Ticket;
}

export const TicketCard: React.FC<TicketCardProps> = ({ticket}) => {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'called':
                return 'bg-blue-100 text-blue-800';
            case 'finished':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'pending':
                return <Clock className="w-4 h-4"/>;
            case 'called':
                return <User className="w-4 h-4"/>;
            case 'finished':
                return <CheckCircle className="w-4 h-4"/>;
            default:
                return <Hash className="w-4 h-4"/>;
        }
    };

    return (
        <Card>
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Hash className="w-6 h-6 text-blue-600"/>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">Ticket ID: {ticket.id}</h3>
                    </div>
                </div>
                <div
                    className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                    {getStatusIcon(ticket.status)}
                    <span className="capitalize">{ticket.status}</span>
                </div>
            </div>

            <div className="space-y-3">
                <div>
                    <p className="text-sm font-medium text-gray-700">Customer</p>
                    <p className="text-sm text-gray-900">{ticket.customer_name}</p>
                    <p className="text-sm text-gray-600">{ticket.customer_phone}</p>
                </div>

                {ticket.counter && (
                    <div>
                        <p className="text-sm font-medium text-gray-700">Counter</p>
                        <p className="text-sm text-gray-900">{ticket.counter.name}</p>
                    </div>
                )}

                {ticket.agent && (
                    <div>
                        <p className="text-sm font-medium text-gray-700">Agent</p>
                        <p className="text-sm text-gray-900">{ticket.agent.name}</p>
                    </div>
                )}

                <div className="pt-3 border-t">
                    <div className="flex justify-between text-sm text-gray-600">
                        <span>Created:</span>
                        <span>{new Date(ticket.created_at).toLocaleString()}</span>
                    </div>
                    {ticket.called_at && (
                        <div className="flex justify-between text-sm text-gray-600 mt-1">
                            <span>Called:</span>
                            <span>{new Date(ticket.called_at).toLocaleString()}</span>
                        </div>
                    )}
                    {ticket.finished_at && (
                        <div className="flex justify-between text-sm text-gray-600 mt-1">
                            <span>Finished:</span>
                            <span>{new Date(ticket.finished_at).toLocaleString()}</span>
                        </div>
                    )}
                </div>
            </div>
        </Card>
    );
};