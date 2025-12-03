import React, {useState} from 'react';
import {useForm} from 'react-hook-form';
import {useAuth} from '../../context/AuthContext';
import {Card} from '../../components/common/Card';
import {Button} from '../../components/common/Button';
import {Input} from '../../components/common/Input';
import {useNavigate} from 'react-router-dom';
import {LogIn} from 'lucide-react';

interface LoginForm {
    email: string;
    password: string;
}

export const LoginPage: React.FC = () => {
    const {login} = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm<LoginForm>();

    const onSubmit = async (data: LoginForm) => {
        console.log("Submitted data:", data);

        setIsLoading(true);
        try {
            await login(data.email, data.password);
        } catch (error) {
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="max-w-md w-full">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-white font-bold text-xl">QMS</span>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
                    <p className="text-gray-600">Sign in to access your dashboard</p>
                </div>

                <Card>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <Input
                            label="Email Address"
                            type="email"
                            autoComplete="email"
                            {...register('email', {
                                required: 'Email is required',
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: 'Please enter a valid email address',
                                },
                            })}
                            error={errors.email?.message}
                            placeholder="Enter your email"
                        />

                        <Input
                            label="Password"
                            type="password"
                            autoComplete="current-password"
                            {...register('password', {
                                required: 'Password is required',
                                minLength: {
                                    value: 6,
                                    message: 'Password must be at least 6 characters',
                                },
                            })}
                            error={errors.password?.message}
                            placeholder="Enter your password"
                        />

                        <Button
                            type="submit"
                            className="w-full"
                            icon={LogIn}
                            isLoading={isLoading}
                        >
                            Sign In
                        </Button>
                    </form>
                </Card>

                <div className="text-center mt-6">
                    <p className="text-sm text-gray-600">
                        Don't have an account? Contact your administrator.
                    </p>
                </div>
            </div>
        </div>
    );
};