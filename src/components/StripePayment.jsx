import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import { useState } from 'react';
import toast from 'react-hot-toast';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const TEST_MODE = true;

const CheckoutForm = ({ orderData, onSuccess }) => {
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);

    try {

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
      
      toast.success("Test payment processed successfully");
      setTimeout(() => {
        onSuccess(testPayment.paymentIntent);
      }, 1500);
      
    } catch (error) {
      console.error("Payment simulation error:", error);
      toast.error("Payment simulation failed. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="border border-gray-300 p-3 rounded-lg">
        <CardElement 
          options={{
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
          }}
        />
      </div>
      
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h3 className="font-bold text-blue-800 mb-2">Academic Project - Test Mode</h3>
        <p className="text-sm text-blue-700">
          This is running in test mode. No real payments will be processed.
          <br />
          <strong>Test Card:</strong> 4242 4242 4242 4242
          <br />
          <strong>Expiry:</strong> Any future date (e.g., 12/34)
          <br />
          <strong>CVC:</strong> Any 3 digits (e.g., 123)
        </p>
      </div>
      
      <button 
        type="submit" 
        className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 px-4 rounded-lg transition-colors duration-300 text-sm"
        disabled={processing}
      >
        {processing ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </span>
        ) : (
          'Process Test Payment'
        )}
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