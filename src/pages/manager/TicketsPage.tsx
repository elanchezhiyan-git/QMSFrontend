import React, {useEffect, useState} from 'react';
import {Card} from '../../components/common/Card';
import {Button} from '../../components/common/Button';
import {Loading} from '../../components/common/Loading';
import {TicketCard} from '../../components/tickets/TicketCard';
import {Ticket} from '../../types';
import {ticketAPI} from '../../api/tickets';
import {Filter, RefreshCw} from 'lucide-react';
import toast from 'react-hot-toast';

export const TicketsPage: React.FC = () => {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filters] = useState({
        status: '',
        counter_id: '',
        agent_id: '',
        date: '',
    });

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [ticketsData] = await Promise.all([
                    ticketAPI.getAllTickets()
                ]);
                setTickets(ticketsData);
            } catch (error) {
                toast.error('Failed to load data');
            } finally {
                setIsLoading(false);
            }
        };

        fetchInitialData();
    }, []);

    const fetchTickets = async (currentFilters = filters) => {
        setIsLoading(true);
        try {
            const cleanFilters = Object.fromEntries(
                Object.entries(currentFilters).filter(([_, value]) => value !== '')
            );
            const data = await ticketAPI.getAllTickets(cleanFilters);
            setTickets(data);
        } catch (error) {
            toast.error('Failed to fetch tickets');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Tickets</h1>
                    <p className="text-gray-600 mt-1">Monitor and filter all system tickets</p>
                </div>
                <Button
                    icon={RefreshCw}
                    onClick={() => fetchTickets()}
                    variant="secondary"
                >
                    Refresh
                </Button>
            </div>

            {/* Results */}
            <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600">
                    Showing {tickets.length} ticket{tickets.length !== 1 ? 's' : ''}
                </p>
            </div>

            {isLoading ? (
                <div className="text-center py-12">
                    <Loading size="lg" text="Loading tickets..."/>
                </div>
            ) : tickets.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {tickets.map((ticket) => (
                        <TicketCard key={ticket.id} ticket={ticket}/>
                    ))}
                </div>
            ) : (
                <Card>
                    <div className="text-center py-12">
                        <div
                            className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Filter className="w-8 h-8 text-gray-400"/>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Tickets Found</h3>
                        <p className="text-gray-600">
                            No tickets match your current filters. Try adjusting your search criteria.
                        </p>
                    </div>
                </Card>
            )}
        </div>
    );
};