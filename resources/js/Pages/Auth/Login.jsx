import { Head, router, usePage } from '@inertiajs/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Receipt } from 'lucide-react';
import { useState } from 'react';

import { loginSchema } from '../../Schemas/auth';

export default function Login() {
    const { errors: serverErrors } = usePage().props;

    const [processing, setProcessing] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
            remember: false,
        },
    });

    const onSubmit = (data) => {
        setProcessing(true);

        router.post('/login', data, {
            onFinish: () => {
                setProcessing(false);
            },
        });
    };

    return (
        <>
            <Head title="Login" />

            <div className="min-h-screen flex items-center justify-center p-4 bg-[#0f1117]">
                <div className="w-full max-w-sm">
                    {/* Logo */}
                    <div className="text-center mb-8">
                        <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center mx-auto mb-4">
                            <Receipt
                                size={24}
                                className="text-white"
                            />
                        </div>

                        <h1 className="text-xl font-semibold text-white">
                            InvoiceApp
                        </h1>

                        <p className="text-sm text-slate-500 mt-1">
                            Sign in to your account
                        </p>
                    </div>

                    {/* Card */}
                    <div className="bg-[#161b27] border border-[#1e2535] rounded-xl p-6">
                        {serverErrors?.email && (
                            <div className="bg-[#450a0a] border border-[#991b1b] text-red-400 rounded-lg p-3 mb-4 text-sm">
                                {serverErrors.email}
                            </div>
                        )}

                        <form
                            onSubmit={handleSubmit(onSubmit)}
                            className="space-y-4"
                        >
                            {/* Email */}
                            <div>
                                <label className="block text-xs font-medium text-slate-400 mb-1.5">
                                    Email
                                </label>

                                <input
                                    type="email"
                                    placeholder="you@example.com"
                                    className="w-full bg-[#161b27] border border-[#252d3f] text-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                                    {...register('email')}
                                />

                                {errors.email && (
                                    <p className="text-red-400 text-xs mt-1">
                                        {errors.email.message}
                                    </p>
                                )}
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-xs font-medium text-slate-400 mb-1.5">
                                    Password
                                </label>

                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    className="w-full bg-[#161b27] border border-[#252d3f] text-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                                    {...register('password')}
                                />

                                {errors.password && (
                                    <p className="text-red-400 text-xs mt-1">
                                        {errors.password.message}
                                    </p>
                                )}
                            </div>

                            {/* Remember */}
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="remember"
                                    {...register('remember')}
                                />

                                <label
                                    htmlFor="remember"
                                    className="text-xs text-slate-400"
                                >
                                    Remember me
                                </label>
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-2.5 rounded-lg text-sm transition-colors"
                            >
                                {processing
                                    ? 'Signing In...'
                                    : 'Sign In'}
                            </button>
                        </form>
                    </div>

                    <p className="text-center text-xs text-slate-600 mt-6">
                        Demo: admin@example.com /
                        agent@example.com — password:{' '}
                        <strong className="text-slate-500">
                            password
                        </strong>
                    </p>
                </div>
            </div>
        </>
    );
}