import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import { useState } from 'react';
import toast from 'react-hot-toast';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

// Test mode configuration
const TEST_MODE = true; // Set to false to enable real payments
const TEST_CARD_OPTIONS = {
  style: {
    base: {
      fontSize: '16px',
      color: '#424770',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
    invalid: {
      color: '#9e2146',
    },
  },
  value: {
    postalCode: '12345'
  }
};

const CheckoutForm = ({ orderData, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);

    try {
      // Always use test mode if enabled, regardless of environment
      if (TEST_MODE) {
        console.log("ACADEMIC TEST MODE: Simulating payment");
        
        const testPayment = {
          paymentIntent: {
            id: 'pi_test_' + Math.random().toString(36).substring(2),
            status: 'succeeded',
            amount: orderData.amount,
            currency: 'lkr',
            created: Math.floor(Date.now() / 1000),
            metadata: {
              test_mode: "true",
              academic_project: "true"
            }
          }
        };
        
        toast.success("Academic Project: Test payment successful");
        onSuccess(testPayment.paymentIntent);
        return;
      }

      // This part will only execute if TEST_MODE is false
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/orders/create-payment-intent`,
        orderData,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );

      const { clientSecret } = response.data;

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: orderData.name,
          },
        },
      });

      if (result.error) {
        toast.error(result.error.message);
      } else if (result.paymentIntent.status === 'succeeded') {
        toast.success("Payment succeeded!");
        onSuccess(result.paymentIntent);
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Payment failed. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="border border-gray-300 p-3 rounded-lg">
        <CardElement options={TEST_CARD_OPTIONS} />
      </div>
      
      {TEST_MODE && (
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h3 className="font-bold text-blue-800 mb-2">Academic Project Notice</h3>
          <p className="text-sm text-blue-700">
            This is running in test mode. No real payments will be processed.
            <br />
            <strong>Test Card:</strong> 4242 4242 4242 4242
            <br />
            <strong>Expiry:</strong> Any future date
            <br />
            <strong>CVC:</strong> Any 3 digits
          </p>
        </div>
      )}
      
      <button 
        type="submit" 
        disabled={!stripe || processing}
        className={`w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-2 px-4 rounded-lg transition-colors duration-300 text-sm ${
          (!stripe || processing) ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {processing ? 'Processing...' : TEST_MODE ? 'Test Payment' : 'Pay Now'}
      </button>
    </form>
  );
};

export default function StripePayment({ orderData, onSuccess }) {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm orderData={orderData} onSuccess={onSuccess} />
    </Elements>
  );
}