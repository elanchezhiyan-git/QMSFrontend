import React, {useEffect, useState} from 'react';
import {Card} from '../../components/common/Card';
import {Button} from '../../components/common/Button';
import {Modal} from '../../components/common/Modal';
import {Input} from '../../components/common/Input';
import {Select} from '../../components/common/Select';
import {Loading} from '../../components/common/Loading';
import {User} from '../../types';
import {userAPI} from '../../api/users';
import {useForm} from 'react-hook-form';
import {CreditCard as Edit, Plus, Trash2, Users} from 'lucide-react';
import toast from 'react-hot-toast';

interface UserFormData {
    email: string;
    password?: string;
    name: string;
    role: string;
    phone?: string;
}

export const UsersPage: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        formState: {errors},
        reset,
        setValue,
    } = useForm<UserFormData>();

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const data = await userAPI.getAllUsers();
            setUsers(data);
        } catch (error) {
            toast.error('Failed to fetch users');
        } finally {
            setIsLoading(false);
        }
    };

    const openCreateModal = () => {
        setEditingUser(null);
        reset();
        setIsModalOpen(true);
    };

    const openEditModal = (user: User) => {
        setEditingUser(user);
        setValue('email', user.email);
        setValue('name', user.name);
        setValue('role', user.role);
        setValue('phone', user.phone || '');
        setIsModalOpen(true);
    };

    const onSubmit = async (data: UserFormData) => {
        setIsSubmitting(true);
        try {
            if (editingUser) {
                const updatedUser = await userAPI.updateUser(editingUser.id, data);
                setUsers(users.map(u => u.id === editingUser.id ? updatedUser : u));
                toast.success('User updated successfully');
            } else {
                if (!data.password) {
                    toast.error('Password is required for new users');
                    return;
                }
                const newUser = await userAPI.createUser(data as Required<UserFormData>);
                setUsers([...users, newUser]);
                toast.success('User created successfully');
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

    const handleDelete = async (user: User) => {
        if (!window.confirm(`Are you sure you want to delete ${user.name}?`)) {
            return;
        }

        try {
            await userAPI.deleteUser(user.id);
            setUsers(users.filter(u => u.id !== user.id));
            toast.success('User deleted successfully');
        } catch (error: any) {
            const message = error.response?.data?.message || 'Failed to delete user';
            toast.error(message);
        }
    };

    const roleOptions = [
        {value: '', label: 'Select role'},
        {value: 'admin', label: 'Admin'},
        {value: 'manager', label: 'Manager'},
        {value: 'agent', label: 'Agent'},
        {value: 'customer', label: 'Customer'},
    ];

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loading size="lg" text="Loading users..."/>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Users</h1>
                    <p className="text-gray-600 mt-1">Manage system users and their roles</p>
                </div>
                <Button icon={Plus} onClick={openCreateModal}>
                    Add User
                </Button>
            </div>

            <Card padding={false}>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                User
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Role
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Phone
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Created
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {users.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-10 w-10">
                                            <div
                                                className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                                                <Users className="w-5 h-5 text-gray-600"/>
                                            </div>
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                            <div className="text-sm text-gray-500">{user.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${
                        user.role === 'admin' ? 'bg-red-100 text-red-800' :
                            user.role === 'manager' ? 'bg-blue-100 text-blue-800' :
                                user.role === 'agent' ? 'bg-green-100 text-green-800' :
                                    'bg-gray-100 text-gray-800'
                    }`}>
                      {user.role}
                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {user.phone || '—'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {new Date(user.created_at).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                    <Button
                                        size="sm"
                                        variant="secondary"
                                        icon={Edit}
                                        onClick={() => openEditModal(user)}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="danger"
                                        icon={Trash2}
                                        onClick={() => handleDelete(user)}
                                    >
                                        Delete
                                    </Button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingUser ? 'Edit User' : 'Create User'}
                size="lg"
            >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <Input
                        label="Full Name"
                        {...register('name', {
                            required: 'Name is required',
                            minLength: {value: 2, message: 'Name must be at least 2 characters'},
                        })}
                        error={errors.name?.message}
                    />

                    <Input
                        label="Email Address"
                        type="email"
                        {...register('email', {
                            required: 'Email is required',
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: 'Please enter a valid email address',
                            },
                        })}
                        error={errors.email?.message}
                    />

                    {!editingUser && (
                        <Input
                            label="Password"
                            type="password"
                            {...register('password', {
                                required: 'Password is required for new users',
                                minLength: {value: 6, message: 'Password must be at least 6 characters'},
                            })}
                            error={errors.password?.message}
                        />
                    )}

                    <Select
                        label="Role"
                        {...register('role', {
                            required: 'Role is required',
                        })}
                        options={roleOptions}
                        error={errors.role?.message}
                    />

                    <Input
                        label="Phone Number (Optional)"
                        type="tel"
                        {...register('phone')}
                        error={errors.phone?.message}
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
                            {editingUser ? 'Update User' : 'Create User'}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};