import { StripeElements, Stripe as IStripe } from '@stripe/stripe-js';

// Note: Stripe secret key should only be used on the server side
// This file handles client-side payment operations only

export const confirmPayment = async (
  stripe: IStripe | null,
  elements: StripeElements,
  clientSecret: string,
  orderUuid: string,
  nonce: string,
) => {
  const origin = window.location.origin;
  const response = await stripe?.confirmPayment({
    elements,
    clientSecret: clientSecret,
    confirmParams: {
      return_url: `${origin}/order/success?orderId=${orderUuid}&nonce=${nonce}`,
    },
  });

  if (response?.error) {
    return {
      success: false,
      data: response.error,
    };
  }

  return {
    success: true,
    data: response,
  };
};
