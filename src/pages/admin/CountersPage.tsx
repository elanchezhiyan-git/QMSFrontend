import React, {useEffect, useState} from 'react';
import {Card} from '../../components/common/Card';
import {Button} from '../../components/common/Button';
import {Modal} from '../../components/common/Modal';
import {Input} from '../../components/common/Input';
import {Loading} from '../../components/common/Loading';
import {Counter} from '../../types';
import {counterAPI} from '../../api/counters';
import {useForm} from 'react-hook-form';
import {Monitor, Pencil, Plus, ToggleLeft, ToggleRight, Trash2} from 'lucide-react';
import toast from 'react-hot-toast';

interface CounterFormData {
    name: string;
    description?: string;
}

export const CountersPage: React.FC = () => {
    const [counters, setCounters] = useState<Counter[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCounter, setEditingCounter] = useState<Counter | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        formState: {errors},
        reset,
        setValue,
    } = useForm<CounterFormData>();

    useEffect(() => {
        fetchCounters();
    }, []);

    const fetchCounters = async () => {
        try {
            const data = await counterAPI.getAllCounters();
            setCounters(data);
        } catch (error) {
            toast.error('Failed to fetch counters');
        } finally {
            setIsLoading(false);
        }
    };

    const openCreateModal = () => {
        setEditingCounter(null);
        reset();
        setIsModalOpen(true);
    };

    const openEditModal = (counter: Counter) => {
        setEditingCounter(counter);
        setValue('name', counter.name);
        setValue('description', counter.description || '');
        setIsModalOpen(true);
    };

    const onSubmit = async (data: CounterFormData) => {
        setIsSubmitting(true);
        try {
            if (editingCounter) {
                const updatedCounter = await counterAPI.updateCounter(editingCounter.id, data);
                setCounters(counters.map(c => c.id === editingCounter.id ? updatedCounter : c));
                toast.success('Counter updated successfully');
            } else {
                const newCounter = await counterAPI.createCounter(data);
                setCounters([...counters, newCounter]);
                toast.success('Counter created successfully');
            }
            setIsModalOpen(false);
            reset();
        } catch (error: any) {
            const message = error.response?.data?.message || 'Operation failed';
            toast.error(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleToggleStatus = async (counter: Counter) => {
        try {
            const updatedCounter = await counterAPI.updateStatus(counter.id, {
                enabled: !counter.enabled,
            });
            setCounters(counters.map(c => c.id === counter.id ? updatedCounter : c));
            toast.success(`Counter ${updatedCounter.enabled ? 'activated' : 'deactivated'}`);
        } catch (error: any) {
            const message = error.response?.data?.message || 'Failed to update counter';
            toast.error(message);
        }
    };

    const handleDelete = async (counter: Counter) => {
        if (!window.confirm(`Are you sure you want to delete ${counter.name}?`)) {
            return;
        }

        try {
            await counterAPI.deleteCounter(counter.id);
            setCounters(counters.filter(c => c.id !== counter.id));
            toast.success('Counter deleted successfully');
        } catch (error: any) {
            const message = error.response?.data?.message || 'Failed to delete counter';
            toast.error(message);
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
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Counters</h1>
                    <p className="text-gray-600 mt-1">Manage service counters and their status</p>
                </div>
                <Button icon={Plus} onClick={openCreateModal}>
                    Add Counter
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {counters.map((counter) => (
                    <Card key={counter.id}>
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center space-x-3">
                                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                                    counter.enabled ? 'bg-green-100' : 'bg-red-100'
                                }`}>
                                    <Monitor className={`w-6 h-6 ${
                                        counter.enabled ? 'text-green-600' : 'text-red-400'
                                    }`}/>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">{counter.name}</h3>
                                    <div
                                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                            counter.enabled
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-400'
                                        }`}>
                                        {counter.enabled ? 'Active' : 'Inactive'}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {counter.description && (
                            <p className="text-sm text-gray-600 mb-4">{counter.description}</p>
                        )}

                        <div className="text-xs text-gray-500 mb-4">
                            <p>Created: {new Date(counter.created_at).toLocaleDateString()}</p>
                        </div>

                        <div className="flex gap-2">
                            <Button
                                size="sm"
                                variant="secondary"
                                icon={counter.enabled ? ToggleRight : ToggleLeft}
                                onClick={() => handleToggleStatus(counter)}
                                className={`flex-1 ${counter.enabled ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}
                            >
                                {counter.enabled ? 'Deactivate' : 'Activate'}
                            </Button>
                            <Button
                                size="sm"
                                variant="secondary"
                                icon={Pencil}
                                onClick={() => openEditModal(counter)}
                                children={undefined}
                            />
                            <Button
                                size="sm"
                                variant="danger"
                                icon={Trash2}
                                onClick={() => handleDelete(counter)}
                                children={undefined}
                            />
                        </div>
                    </Card>
                ))}
            </div>

            {counters.length === 0 && (
                <div className="text-center py-12">
                    <Monitor className="w-16 h-16 text-gray-300 mx-auto mb-4"/>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Counters</h3>
                    <p className="text-gray-600">Create your first counter to get started.</p>
                </div>
            )}

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingCounter ? 'Edit Counter' : 'Create Counter'}
                size="lg"
            >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <Input
                        label="Counter Name"
                        {...register('name', {
                            required: 'Counter name is required',
                            minLength: {value: 2, message: 'Name must be at least 2 characters'},
                        })}
                        error={errors.name?.message}
                        placeholder="e.g., General Service, VIP Counter"
                    />

                    <Input
                        label="Description (Optional)"
                        {...register('description')}
                        error={errors.description?.message}
                        placeholder="Brief description of this counter's purpose"
                    />

                    <div className="flex gap-3 pt-4">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => setIsModalOpen(false)}
                            className="flex-1"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            isLoading={isSubmitting}
                            className="flex-1"
                        >
                            {editingCounter ? 'Update Counter' : 'Create Counter'}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};