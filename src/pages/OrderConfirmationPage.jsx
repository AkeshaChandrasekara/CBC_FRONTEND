import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FiCheckCircle, FiPackage, FiTruck, FiHome, FiShoppingBag, FiMail } from "react-icons/fi";
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
    <div className="min-h-screen bg-gradient-to-b from-white to-pink-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-3xl bg-white rounded-2xl shadow-lg overflow-hidden border border-pink-100"
      >
   
        <div className="bg-gradient-to-r from-pink-600 to-pink-700 p-3 text-center relative overflow-hidden">
         
          <div className="absolute top-0 left-0 w-32 h-32 bg-pink-500 opacity-10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-pink-400 opacity-10 rounded-full translate-x-1/3 translate-y-1/3"></div>
          
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 150 }}
            className="inline-block mb-4"
          >
            <div className="w-20 h-20 rounded-full bg-white bg-opacity-20 flex items-center justify-center mx-auto">
              <FiCheckCircle className="text-white text-4xl" />
            </div>
          </motion.div>
          
          <h1 className="text-3xl font-bold text-white mb-2">Order Confirmed!</h1>
          <p className="text-pink-100">Your order <span className="font-semibold">#{orderId}</span> has been successfully placed</p>
        </div>

        <div className="p-8 space-y-8">
     
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">Thank You For Your Order</h2>
            <p className="text-gray-600 max-w-lg mx-auto">
              We've received your beauty products order and it's now being prepared. 
              You'll receive a confirmation email shortly with all the details.
            </p>
          </div>

          <div className="py-6 border-y border-gray-100">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
              <div className="flex flex-col items-center text-center w-full sm:w-1/3">
                <div className="w-16 h-16 rounded-full bg-pink-100 flex items-center justify-center mb-3 relative">
                  <FiPackage className="text-pink-600 text-xl" />
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-pink-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">1</span>
                  </div>
                </div>
                <h3 className="font-medium text-gray-900 mb-1">Processing</h3>
                <p className="text-sm text-gray-500">We're carefully preparing your beauty items</p>
              </div>

              <div className="hidden sm:block">
                <div className="w-12 h-0.5 bg-pink-200"></div>
              </div>

              <div className="flex flex-col items-center text-center w-full sm:w-1/3">
                <div className="w-16 h-16 rounded-full bg-pink-100 flex items-center justify-center mb-3 relative">
                  <FiTruck className="text-pink-600 text-xl" />
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-pink-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">2</span>
                  </div>
                </div>
                <h3 className="font-medium text-gray-900 mb-1">Shipping</h3>
                <p className="text-sm text-gray-500">Your package will be dispatched soon</p>
              </div>

              <div className="hidden sm:block">
                <div className="w-12 h-0.5 bg-pink-200"></div>
              </div>

              <div className="flex flex-col items-center text-center w-full sm:w-1/3">
                <div className="w-16 h-16 rounded-full bg-pink-100 flex items-center justify-center mb-3 relative">
                  <FiHome className="text-pink-600 text-xl" />
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-pink-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">3</span>
                  </div>
                </div>
                <h3 className="font-medium text-gray-900 mb-1">Delivery</h3>
                <p className="text-sm text-gray-500">Your beauty package will arrive in 2-4 days</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.03, boxShadow: "0 4px 12px rgba(219, 39, 119, 0.15)" }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/products")}
              className="px-6 py-3 bg-white border border-pink-200 text-pink-600 font-medium rounded-xl hover:bg-pink-50 transition-all flex items-center justify-center"
            >
              <FiShoppingBag className="mr-2" />
              Continue Shopping
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.03, boxShadow: "0 4px 12px rgba(219, 39, 119, 0.25)" }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/orders")}
              className="px-6 py-3 bg-gradient-to-r from-pink-600 to-pink-700 text-white font-medium rounded-xl hover:from-pink-700 hover:to-pink-800 transition-all flex items-center justify-center"
            >
              View Order Details
            </motion.button>
          </div>

         
        </div>
      </motion.div>
    </div>
  );
}