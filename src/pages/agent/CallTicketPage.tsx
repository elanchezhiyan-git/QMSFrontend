import React, {useEffect, useState} from 'react';
import {Card} from '../../components/common/Card';
import {Button} from '../../components/common/Button';
import {Loading} from '../../components/common/Loading';
import {TicketCard} from '../../components/tickets/TicketCard';
import {Ticket} from '../../types';
import {agentAPI} from '../../api/agent';
import {useAuth} from '../../context/AuthContext';
import {CheckCircle, Phone, Users} from 'lucide-react';
import toast from 'react-hot-toast';

export const CallTicketPage: React.FC = () => {
    const {user} = useAuth();
    const [currentTicket, setCurrentTicket] = useState<Ticket | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isCalling, setIsCalling] = useState(false);
    const [isFinishing, setIsFinishing] = useState(false);

    useEffect(() => {
        const fetchCurrentTicket = async () => {
            try {
                const ticket = await agentAPI.getCurrentTicket();
                setCurrentTicket(ticket);
            } catch (error) {
                // No current ticket is expected behavior
            } finally {
                setIsLoading(false);
            }
        };

        fetchCurrentTicket();
    }, []);

    const handleCallNext = async () => {
        debugger
        if (!user?.counter_id) {
            toast.error('No counter selected');
            return;
        }

        setIsCalling(true);
        try {
            const ticket = await agentAPI.callNextTicket(user.counter_id);
            setCurrentTicket(ticket);
            toast.success(`Called ticket #${ticket.queue_number}`);

            // Play notification sound (optional)
            try {
                const audio = new Audio('/notification.wav');
                audio.play().catch(() => {
                    // Ignore audio errors
                });
            } catch (error) {
                // Ignore audio errors
            }
        } catch (error: any) {
            const message = error.response?.data?.message || 'No tickets in queue';
            toast.error(message);
        } finally {
            setIsCalling(false);
        }
    };

    const handleFinishTicket = async () => {
        if (!currentTicket) return;

        setIsFinishing(true);
        try {
            await agentAPI.finishTicket(currentTicket.id);
            setCurrentTicket(null);
            toast.success('Ticket finished successfully!');
        } catch (error: any) {
            const message = error.response?.data?.message || 'Failed to finish ticket';
            toast.error(message);
        } finally {
            setIsFinishing(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loading size="lg" text="Loading agent panel..."/>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Agent Panel</h1>
                <p className="text-gray-600">
                    Manage your queue and serve customers efficiently.
                </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
                {/* Current Ticket */}
                <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                        <Users className="w-5 h-5 mr-2"/>
                        Current Ticket
                    </h2>

                    {currentTicket ? (
                        <div className="space-y-6">
                            <TicketCard ticket={currentTicket}/>

                            <div className="flex gap-4">
                                <Button
                                    variant="success"
                                    onClick={handleFinishTicket}
                                    icon={CheckCircle}
                                    isLoading={isFinishing}
                                    className="flex-1"
                                >
                                    Finish Service
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <Card>
                            <div className="text-center py-8">
                                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4"/>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    No Active Ticket
                                </h3>
                                <p className="text-gray-600">
                                    Call the next customer to start serving.
                                </p>
                            </div>
                        </Card>
                    )}
                </div>

                {/* Actions */}
                <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Actions</h2>

                    <Card>
                        <div className="space-y-6">
                            <div className="text-center">
                                <div
                                    className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Phone className="w-8 h-8 text-blue-600"/>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    Call Next Customer
                                </h3>
                                <p className="text-gray-600 mb-6">
                                    Call the next customer in the queue to your counter.
                                </p>
                                <Button
                                    onClick={handleCallNext}
                                    icon={Phone}
                                    isLoading={isCalling}
                                    className="w-full"
                                    disabled={!!currentTicket}
                                >
                                    {currentTicket ? 'Finish Current Ticket First' : 'Call Next'}
                                </Button>
                            </div>

                            {user?.counter_id && (
                                <div className="pt-6 border-t">
                                    <div className="text-sm text-gray-600 text-center">
                                        <p className="font-medium">Current Counter</p>
                                        <p>Counter ID: {user.counter_id}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};