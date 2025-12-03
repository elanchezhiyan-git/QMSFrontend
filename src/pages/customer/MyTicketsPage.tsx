import React, {useEffect, useState} from 'react';

import {TicketCard} from '../../components/tickets/TicketCard';
import {Loading} from '../../components/common/Loading';
import {Ticket} from '../../types';
import {ticketAPI} from '../../api/tickets';
import {Ticket as TicketIcon} from 'lucide-react';
import toast from 'react-hot-toast';


export const MyTicketsPage: React.FC = () => {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        getTickets();
    }, [])


    const getTickets = async () => {
        setIsLoading(true);
        setTickets([]);

        try {
            const ticketData = await ticketAPI.getAllTickets();
            setTickets(ticketData);
            if (ticketData.length === 0) {
                toast.success('No tickets found');
            }
        } catch (error: any) {
            const message = error.response?.data?.message || 'Failed to fetch tickets';
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    };

    console.log("Tickets", tickets);

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">My Tickets</h1>
            </div>

            {isLoading && (
                <div className="text-center py-8">
                    <Loading size="lg" text="Searching for your tickets..."/>
                </div>
            )}

            {tickets.length === 0 && !isLoading && (
                <div className="text-center py-12">
                    <TicketIcon className="w-16 h-16 text-gray-300 mx-auto mb-4"/>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Tickets Found</h3>
                    <p className="text-gray-600">
                        No tickets were found
                    </p>
                </div>
            )}

            {tickets.length > 0 && (
                <div className="space-y-6">
                    <div className="text-center">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                            Found {tickets.length} ticket{tickets.length > 1 ? 's' : ''}
                        </h2>
                        <p className="text-gray-600">Here are all your tickets:</p>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                        {tickets.map((ticket) => (
                            <TicketCard key={ticket.id} ticket={ticket}/>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};