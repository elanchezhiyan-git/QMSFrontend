import React, {useEffect, useState} from 'react';
import {useForm} from 'react-hook-form';
import {Button} from '../common/Button';
import {Input} from '../common/Input';
import {Select} from '../common/Select';
import {Counter} from '../../types';
import {counterAPI} from '../../api/counters';
import {ticketAPI} from '../../api/tickets';
import toast from 'react-hot-toast';

interface TicketFormData {
    name: string;
    phone: string;
    counter_id: string;
}

interface TicketFormProps {
    onSuccess?: () => void;
}

export const TicketForm: React.FC<TicketFormProps> = ({onSuccess}) => {
    const [counters, setCounters] = useState<Counter[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: {errors},
        reset,
    } = useForm<TicketFormData>();

    useEffect(() => {
        const fetchCounters = async () => {
            try {
                const data = await counterAPI.getPublicCounters();
                setCounters(data.filter(counter => counter.enabled));
            } catch (error) {
                toast.error('Failed to load counters');
            }
        };

        fetchCounters();
    }, []);

    const onSubmit = async (data: TicketFormData) => {
        setIsLoading(true);
        try {
            const ticket = await ticketAPI.createTicket(data);
            toast.success(`Ticket #${ticket.id} created successfully!`);
            reset();
            onSuccess?.();
        } catch (error: any) {
            const message = error.response?.data?.message || 'Failed to create ticket';
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    };

    const counterOptions = [
        {value: '', label: 'Select a counter'},
        ...counters.map(counter => ({
            value: counter.id,
            label: counter.name,
        })),
    ];

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input
                label="Full Name"
                {...register('name', {
                    required: 'Name is required',
                    minLength: {value: 2, message: 'Name must be at least 2 characters'},
                })}
                error={errors.name?.message}
                placeholder="Enter your full name"
            />

            <Input
                label="Phone Number"
                type="tel"
                {...register('phone', {
                    required: 'Phone number is required',
                    pattern: {
                        value: /^\+?[\d\s-()]+$/,
                        message: 'Please enter a valid phone number',
                    },
                })}
                error={errors.phone?.message}
                placeholder="Enter your phone number"
            />

            <Select
                label="Select Counter"
                {...register('counter_id', {
                    required: 'Please select a counter',
                })}
                options={counterOptions}
                error={errors.counter_id?.message}
            />

            <Button
                type="submit"
                className="w-full"
                isLoading={isLoading}
            >
                Create Ticket
            </Button>
        </form>
    );
};