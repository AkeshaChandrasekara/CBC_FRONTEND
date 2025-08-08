import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import { useState } from 'react';
import toast from 'react-hot-toast';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const CheckoutForm = ({ orderData, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [email, setEmail] = useState('');

  const handleSubmit = async (event) => {
  event.preventDefault();

  if (!stripe || !elements) {
    setError('Stripe has not loaded. Please try again.');
    toast.error('Stripe has not loaded. Please try again.');
    return;
  }

  setProcessing(true);
  setError(null);

  const { error: submitError } = await elements.submit();
  if (submitError) {
    setError(submitError.message);
    toast.error(submitError.message);
    setProcessing(false);
    return;
  }

  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/orders/create-payment-intent`,
      orderData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );

    const { clientSecret } = response.data;

    if (!clientSecret) {
      throw new Error('No client secret received from server.');
    }

    const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: {
        return_url: `${window.location.origin}/orders`,
        receipt_email: email,
        payment_method_data: {
          billing_details: {
            email: email,
            name: orderData.name,
            address: {
              line1: orderData.address,
              country: 'LK', 
            },
            phone: orderData.phone,
          }
        }
      },
    });

    if (stripeError) {
      setError(stripeError.message);
      toast.error(stripeError.message);
    } else if (paymentIntent.status === 'succeeded') {
      toast.success('Payment successful!');
      onSuccess(paymentIntent);
    }
  } catch (error) {
    console.error('Payment error:', error);
    setError(error.message || 'Payment failed. Please try again.');
    toast.error(error.message || 'Payment failed. Please try again.');
  } finally {
    setProcessing(false);
  }
};

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="mb-4">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
          placeholder="test@example.com"
          required
        />
      </div>

      <div className="border border-gray-300 p-3 rounded-lg">
        <PaymentElement
          options={{
            layout: 'tabs',
            fields: {
              billingDetails: {
                email: 'never',
                phone: 'never',
              },
            },
          }}
        />
      </div>

      {error && <div className="text-red-500 text-sm">{error}</div>}

      <button
        type="submit"
        disabled={!stripe || processing}
        className={`w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 px-4 rounded-lg transition-colors duration-300 text-sm ${
          !stripe || processing ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {processing ? (
          <span className="flex items-center justify-center">
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-black"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Processing...
          </span>
        ) : (
          'Pay Now'
        )}
      </button>
    </form>
  );
};

export default function StripePayment({ orderData, onSuccess }) {
  const options = {
    mode: 'payment',
    amount: orderData.amount,
    currency: 'lkr',
    appearance: {
      theme: 'stripe',
    },
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      <CheckoutForm orderData={orderData} onSuccess={onSuccess} />
    </Elements>
  );
}