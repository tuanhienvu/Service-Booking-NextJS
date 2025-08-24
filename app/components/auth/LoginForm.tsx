'use client';

import React, { useState, useTransition } from 'react';
import { MdEmail, MdKey } from 'react-icons/md';
import { LiaUserLockSolid } from 'react-icons/lia';
import Link from 'next/link';
import { login } from '@/app/lib/utils/authUtils';
import toast from 'react-hot-toast';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useRouter } from 'next/navigation';

interface LoginFormProps {
  redirectTo?: string;
}

type Inputs = {
  email: string;
  password: string;
};

const LoginForm: React.FC<LoginFormProps> = ({ redirectTo }) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const emailValidationSchema = {
    required: 'Email is required.',
    pattern: {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      message: 'Invalid email address',
    },
  };

  const passwordValidationSchema = {
    required: 'Password is required.',
  };

  const submitForm: SubmitHandler<Inputs> = (data) => {
    if (isPending) return;

    startTransition(async () => {
      try {
        toast.remove();
        const response = await login(data, redirectTo || '/');

        if (response.success) {
          toast.success('Login successful!');
          // Redirect to the appropriate page
          router.push(response.redirectTo || '/');
        } else {
          toast.error(response.error || 'Login failed');
        }
      } catch (error) {
        toast.error('An error occurred during login');
      }
    });
  };

  return (
    <>
      <div className="flex items-center justify-center p-6 border-[3px] border-solid border-primary/15 rounded-full">
        <LiaUserLockSolid className="w-[80px] h-[80px] text-primary" />
      </div>
      <div className="flex flex-col item-center justify-center gap-4 w-[90%] sm:w-[500px] bg-white p-14 rounded-badge shadow-md border-[1px] border-solid border-gray-200">
        <h1 className="text-2xl font-bold text-center text-gray-900 mb-4">Welcome Back</h1>

        {redirectTo && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
            <p className="text-sm text-blue-800">Please sign in to continue to your requested page.</p>
          </div>
        )}

        <form onSubmit={handleSubmit(submitForm)} className="flex flex-col w-full gap-4" autoComplete="off">
          <div className="flex flex-col w-full gap-2">
            <label className="input input-bordered input-primary input-md w-full max-w-full flex rounded-badge items-center gap-2">
              <MdEmail />
              <input type="text" className="grow" placeholder="Email" {...register('email', emailValidationSchema)} />
            </label>
            {errors.email && <p className="text-xs text-error">{errors.email.message}</p>}
          </div>

          <div className="flex flex-col w-full gap-2">
            <label className="input input-bordered input-primary input-md w-full max-w-full flex rounded-badge items-center gap-2">
              <MdKey />
              <input
                type="password"
                className="grow"
                placeholder="Password"
                {...register('password', passwordValidationSchema)}
              />
            </label>
            {errors.password && <p className="text-xs text-error">{errors.password.message}</p>}
          </div>

          <button className="btn btn-primary font-normal gap-2" type="submit" disabled={isPending}>
            {isPending && <span className="loading loading-spinner"></span>}
            Sign In
          </button>
        </form>

        <div className="text-center space-y-2">
          <Link href="/forgot-password" className="text-sm text-primary hover:underline">
            Forgot your password?
          </Link>
          <div className="text-sm text-gray-600">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-primary hover:underline">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginForm;
