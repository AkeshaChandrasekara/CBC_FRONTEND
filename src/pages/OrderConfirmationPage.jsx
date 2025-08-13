import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaCheckCircle, FaBox, FaTruck, FaBoxOpen } from "react-icons/fa";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

export default function OrderConfirmationPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const orderId = location.state?.orderId;

  useEffect(() => {
    if (!orderId) {
      toast.error("No order information found");
      navigate("/");
    }
  }, [orderId, navigate]);

  if (!orderId) return null;

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-3xl bg-white rounded-xl shadow-lg overflow-hidden"
      >

        <div className="bg-slate-900 p-8 text-center">
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3 }}
            className="inline-block"
          >
            <FaCheckCircle className="text-white text-5xl mx-auto mb-2" />
          </motion.div>
          <h1 className="text-2xl font-bold text-white mb-2">Order Confirmed!</h1>
          <p className="text-gray-100 text-sm">Your order #{orderId} has been received</p>
        </div>

        <div className="p-6 space-y-6">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Thank You For Your Order</h2>
            <p className="text-gray-600 max-w-lg mx-auto text-sm">
              We've received your beauty products order and it's now being prepared. You'll receive a confirmation email shortly.
            </p>
          </div>

          <div className="py-4">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex flex-col items-center text-center w-full sm:w-1/3">
                <div className="w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center mb-2">
                  <FaBox className="text-white text-sm" />
                </div>
                <h3 className="font-medium text-gray-900">Processing</h3>
                <p className="text-xs text-gray-500 mt-1">We're carefully preparing your beauty items</p>
              </div>

              <div className="flex flex-col items-center text-center w-full sm:w-1/3">
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center mb-2">
                  <FaBoxOpen className="text-white text-sm" />
                </div>
                <h3 className="font-medium text-gray-900">Packing</h3>
                <p className="text-xs text-gray-500 mt-1">Your cosmetics are being securely packaged</p>
              </div>

              <div className="flex flex-col items-center text-center w-full sm:w-1/3">
                <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center mb-2">
                  <FaTruck className="text-white text-sm" />
                </div>
                <h3 className="font-medium text-gray-900">Delivery</h3>
                <p className="text-xs text-gray-500 mt-1">Your beauty package will arrive in 2-4 days</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/")}
              className="px-6 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-all text-sm"
            >
              Continue Shopping
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/orders")}
              className="px-6 py-2 bg-yellow-500 text-black font-medium rounded-lg hover:bg-yellow-400 transition-all text-sm"
            >
              View Order Details
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}