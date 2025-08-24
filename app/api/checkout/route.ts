import { NextResponse, NextRequest } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2023-10-16',
});

export async function POST(req: NextRequest) {
  const data = await req.json();
  const { amount } = data;

  if (!data) {
    return NextResponse.json(new Error('Data is required'), { status: 400 });
  }

  if (!amount) {
    return NextResponse.json(new Error('Amount is required'), { status: 400 });
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(Number(amount) * 100), // Convert to cents
      currency: 'usd',
      description: 'Service Payment',
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return NextResponse.json(
      {
        client_secret: paymentIntent.client_secret,
        payment_intent_id: paymentIntent.id,
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error('Payment intent creation error:', error);
    return NextResponse.json({ error: 'Failed to create payment intent' }, { status: 500 });
  }
}
