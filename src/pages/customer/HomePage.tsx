import React, {useState} from 'react';
import {Card} from '../../components/common/Card';
import {Button} from '../../components/common/Button';
import {TicketForm} from '../../components/forms/TicketForm';
import {Modal} from '../../components/common/Modal';
import {Search, Ticket, TicketPlus} from 'lucide-react';
import {Link} from 'react-router-dom';

export const HomePage: React.FC = () => {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                    Welcome to Queue Management System
                </h1>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Create a new ticket or check your existing tickets. Our smart queue management
                    system ensures efficient service for all customers.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
                <Card>
                    <div className="text-center">
                        <div
                            className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <TicketPlus className="w-8 h-8 text-blue-600"/>
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">Create New Ticket</h2>
                        <p className="text-gray-600 mb-6">
                            Get a new queue number and join the line for service at your preferred counter.
                        </p>
                        <Button
                            className="w-full"
                            onClick={() => setIsCreateModalOpen(true)}
                        >
                            Create Ticket
                        </Button>
                    </div>
                </Card>

                <Card>
                    <div className="text-center">
                        <div
                            className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search className="w-8 h-8 text-green-600"/>
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">Check Ticket Status</h2>
                        <p className="text-gray-600 mb-6">
                            Look up your ticket status or view all your previous tickets using your phone number.
                        </p>
                        <div className="space-y-3">
                            <Link to="/ticket-status" className="block">
                                <Button variant="secondary" className="w-full">
                                    Check Status
                                </Button>
                            </Link>
                            <Link to="/my-tickets" className="block">
                                <Button variant="secondary" className="w-full">
                                    My Tickets
                                </Button>
                            </Link>
                        </div>
                    </div>
                </Card>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-8">
                <div className="text-center">
                    <Ticket className="w-12 h-12 text-blue-600 mx-auto mb-4"/>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">How it works</h3>
                    <p className="text-gray-600 max-w-xl mx-auto">
                        Simply create a ticket, receive your queue number, and wait for your turn.
                        You'll be notified when it's time for your service.
                    </p>
                </div>
            </div>

            <Modal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                title="Create New Ticket"
                size="lg"
            >
                <TicketForm onSuccess={() => setIsCreateModalOpen(false)}/>
            </Modal>
        </div>
    );
};