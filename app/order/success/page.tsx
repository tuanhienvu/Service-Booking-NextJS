import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import OrderSuccessDetails from '@/app/components/order/OrderSuccessDetails';
import apiService from '@/app/lib/services/apiService';
import { getSession } from '@/app/lib/utils/authUtils';
import { redirect } from 'next/navigation';
import Loading from '@/app/components/misc/Loading';
import { cookies } from 'next/headers';

export const metadata: Metadata = {
  title: 'Service - Order Successfully',
  description: 'Service details description',
  keywords: 'next, next.js, react, app, booking',
};

const OrderSuccess = async ({ searchParams }: { searchParams: { orderId: string; nonce: string } }) => {
  const session = await getSession();

  if (!session) {
    redirect('/');
  }

  // Get the JWT token from cookies
  const token = cookies().get('auth-token')?.value;

  if (!token) {
    redirect('/');
  }

  let order = null;
  const responseOrder = await apiService.orders.getOrderDetails({
    id: searchParams.orderId,
    token: token,
  });

  if (!responseOrder.success) {
    redirect('/');
  }

  if (responseOrder.success) {
    order = {
      details: responseOrder.data,
    };
  }

  return (
    <div className="order-success flex flex-col w-full">
      <div className="container mx-auto flex flex-col justify-center flex-grow">
        <Suspense
          fallback={
            <Loading
              size="large"
              classNameContainer="flex justify-center items-center my-0 mx-auto"
              className="text-primary"
            />
          }
        >
          <OrderSuccessDetails order={JSON.stringify(order)} nonce={searchParams.nonce} />
        </Suspense>
      </div>
    </div>
  );
};

export default OrderSuccess;
