import React, {useEffect, useState} from 'react';
import {Card} from '../../components/common/Card';
import {Button} from '../../components/common/Button';
import {Loading} from '../../components/common/Loading';
import {Counter} from '../../types';
import {counterAPI} from '../../api/counters';
import {agentAPI} from '../../api/agent';
import {useNavigate} from 'react-router-dom';
import {ChevronRight, Monitor} from 'lucide-react';
import toast from 'react-hot-toast';
import {useAuth} from "../../context/AuthContext.tsx";

export const CounterSelectionPage: React.FC = () => {
    const [counters, setCounters] = useState<Counter[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedCounter, setSelectedCounter] = useState<string>('');
    const [isSelecting, setIsSelecting] = useState(false);
    const navigate = useNavigate();
    const {setCounter} = useAuth()

    useEffect(() => {
        const fetchCounters = async () => {
            try {
                const data = await counterAPI.getAllCounters();
                setCounters(data.filter(counter => counter.enabled));
            } catch (error) {
                toast.error('Failed to load counters');
            } finally {
                setIsLoading(false);
            }
        };

        fetchCounters();
    }, []);

    const handleSelectCounter = async () => {
        if (!selectedCounter) return;

        setIsSelecting(true);
        try {
            await agentAPI.selectCounter(selectedCounter);
            setCounter(selectedCounter);
            toast.success('Counter selected successfully!');
            navigate('/agent/call');
        } catch (error: any) {
            const message = error.response?.data?.message || 'Failed to select counter';
            toast.error(message);
        } finally {
            setIsSelecting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loading size="lg" text="Loading counters..."/>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Select Your Counter</h1>
                <p className="text-gray-600">
                    Choose the counter you'll be serving customers from today.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
                {counters.map((counter) => (
                    <Card
                        key={counter.id}
                        className={`cursor-pointer transition-all hover:shadow-md ${
                            selectedCounter === counter.id
                                ? 'ring-2 ring-blue-500 bg-blue-50'
                                : 'hover:bg-gray-50'
                        }`}
                        onClick={() => setSelectedCounter(counter.id)}
                    >
                        <div className="text-center">
                            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                                selectedCounter === counter.id
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-600'
                            }`}>
                                <Monitor className="w-8 h-8"/>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                {counter.name}
                            </h3>
                            {counter.description && (
                                <p className="text-sm text-gray-600 mb-4">
                                    {counter.description}
                                </p>
                            )}
                            <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                selectedCounter === counter.id
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-gray-100 text-gray-800'
                            }`}>
                                {selectedCounter === counter.id ? 'Selected' : 'Available'}
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {counters.length === 0 && (
                <div className="text-center py-12">
                    <Monitor className="w-16 h-16 text-gray-300 mx-auto mb-4"/>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Counters Available</h3>
                    <p className="text-gray-600">
                        No active counters are currently available. Please contact your administrator.
                    </p>
                </div>
            )}

            {selectedCounter && (
                <div className="text-center">
                    <Button
                        onClick={handleSelectCounter}
                        size="lg"
                        icon={ChevronRight}
                        isLoading={isSelecting}
                        className="px-8"
                    >
                        Start Serving
                    </Button>
                </div>
            )}
        </div>
    );
};