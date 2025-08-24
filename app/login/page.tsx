import React from 'react';
import LoginForm from '@/app/components/auth/LoginForm';
import { redirect } from 'next/navigation';
import { getUser } from '@/app/lib/utils/authUtils';

export const metadata = {
  title: 'Service - Login',
  description: 'Service login description',
  keywords: 'next, next.js, react, app, booking',
};

interface LoginPageProps {
  searchParams: { redirect?: string };
}

const Login = async ({ searchParams }: LoginPageProps) => {
  const user = await getUser();

  if (user) {
    // If user is already logged in, redirect to intended page or home
    const redirectTo = searchParams.redirect || '/';
    redirect(redirectTo);
  }

  return (
    <div className="login flex flex-col items-center justify-center w-full gap-4 py-8">
      <LoginForm redirectTo={searchParams.redirect} />
    </div>
  );
};

export default Login;
