import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function SuccessPage() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/orders/verify-payment?session_id=${sessionId}`,
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        );
        
        if (response.data.paid) {
          toast.success("Payment successful! Your order is being processed.");
        } else {
          toast.error("Payment verification failed");
        }
      } catch (error) {
        console.error("Verification error:", error);
        toast.error("Error verifying payment");
      }
    };

    if (sessionId) {
      verifyPayment();
    }
  }, [sessionId]);

  return (
    <div className="container mx-auto px-4 py-8 text-center">
      <h1 className="text-2xl font-bold mb-4">Payment Successful</h1>
      <p>Thank you for your order!</p>
    </div>
  );
}