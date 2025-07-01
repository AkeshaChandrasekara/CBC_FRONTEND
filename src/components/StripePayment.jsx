import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import { useState } from 'react';
import toast from 'react-hot-toast';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

// Test card details for development
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
    postalCode: '12345' // Test postal code
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
     
      if (import.meta.env.MODE === 'development') {
        console.log("TEST MODE: Bypassing actual payment processing");
        
      
        const testPayment = {
          paymentIntent: {
            id: 'pi_test_' + Math.random().toString(36).substring(2),
            status: 'succeeded',
            amount: orderData.amount,
            currency: 'lkr',
            created: Math.floor(Date.now() / 1000)
          }
        };
        
        toast.success("TEST MODE: Payment succeeded (simulated)");
        onSuccess(testPayment.paymentIntent);
        return;
      }

   
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
      console.error("Payment error details:", error);
      if (error.response) {
      
        console.error("Error data:", error.response.data);
        console.error("Error status:", error.response.status);
        console.error("Error headers:", error.response.headers);
        toast.error(`Payment failed: ${error.response.data.message || error.response.statusText}`);
      } else if (error.request) {
       
        console.error("No response received:", error.request);
        toast.error("No response from server. Please check your connection.");
      } else {
   
        console.error("Request setup error:", error.message);
        toast.error("Payment setup failed. Please try again.");
      }
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="border border-gray-300 p-3 rounded-lg">
        <CardElement options={TEST_CARD_OPTIONS} />
      </div>
      
      <div className="text-sm text-gray-500 mb-2">
        <strong>TEST MODE:</strong> Use card number 4242 4242 4242 4242, any future expiry, and any CVC
      </div>
      
      <button 
        type="submit" 
        disabled={!stripe || processing}
        className={`w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-2 px-4 rounded-lg transition-colors duration-300 text-sm ${
          (!stripe || processing) ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {processing ? 'Processing...' : 'Pay Now'}
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