import React, {useState} from 'react';
import {useForm} from 'react-hook-form';
import {Card} from '../../components/common/Card';
import {Button} from '../../components/common/Button';
import {Input} from '../../components/common/Input';
import {TicketCard} from '../../components/tickets/TicketCard';
import {Loading} from '../../components/common/Loading';
import {Ticket} from '../../types';
import {ticketAPI} from '../../api/tickets';
import {Search} from 'lucide-react';
import toast from 'react-hot-toast';

interface SearchForm {
    ticketId: string;
}

export const TicketStatusPage: React.FC = () => {
    const [ticket, setTicket] = useState<Ticket | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm<SearchForm>();

    const onSubmit = async (data: SearchForm) => {
        setIsLoading(true);
        setTicket(null);

        try {
            const ticketData = await ticketAPI.getTicketStatus(data.ticketId.trim());
            setTicket(ticketData);
        } catch (error: any) {
            const message = error.response?.data?.message || 'Ticket not found';
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto px-4 py-8">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Check Ticket Status</h1>
                <p className="text-gray-600">
                    Enter your ticket ID to check the current status and details.
                </p>
            </div>

            <Card className="mb-8">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <Input
                        label="Ticket ID"
                        placeholder="Enter your ticket ID"
                        {...register('ticketId', {
                            required: 'Ticket ID is required',
                        })}
                        error={errors.ticketId?.message}
                    />
                    <Button
                        type="submit"
                        className="w-full"
                        icon={Search}
                        isLoading={isLoading}
                    >
                        Check Status
                    </Button>
                </form>
            </Card>

            {isLoading && (
                <div className="text-center py-8">
                    <Loading size="lg" text="Searching for your ticket..."/>
                </div>
            )}

            {ticket && (
                <div className="space-y-6">
                    <div className="text-center">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Ticket Found!</h2>
                        <p className="text-gray-600">Here are your ticket details:</p>
                    </div>
                    <TicketCard ticket={ticket}/>
                </div>
            )}
        </div>
    );
};