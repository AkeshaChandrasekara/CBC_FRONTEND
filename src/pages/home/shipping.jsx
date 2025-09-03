import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CartCard from "../../components/cartCard";
import toast from "react-hot-toast";
import axios from "axios";
import StripePayment from "../../components/StripePayment";
import { FiTruck, FiMapPin, FiPhone, FiUser, FiArrowLeft, FiFileText } from "react-icons/fi";

export default function ShippingPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const cart = location.state?.items;
  const [originalTotal, setOriginalTotal] = useState(0);
  const [discountedTotal, setDiscountedTotal] = useState(0);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [orderData, setOrderData] = useState(null);
  const [showPayment, setShowPayment] = useState(false);
  const [cartWithDetails, setCartWithDetails] = useState([]);

  useEffect(() => {
    if (!cart) {
      toast.error("No items received");
      navigate("/cart");
      return;
    }

    const calculateOriginalTotal = async () => {
      let calculatedTotal = 0;
      const cartDetails = [];
      
      for (const item of cart) {
        try {
          const response = await axios.get(import.meta.env.VITE_BACKEND_URL + "/api/products/" + item.productId);
          if (response.data) {
            const price = response.data.lastPrice || response.data.price;
            calculatedTotal += price * item.qty;
            cartDetails.push({
              ...item,
              productName: response.data.productName,
              images: response.data.images,
              price: response.data.price,
              lastPrice: response.data.lastPrice
            });
          }
        } catch (error) {
          console.error("Error fetching product price:", error);
        }
      }
      
      setOriginalTotal(calculatedTotal);
      setCartWithDetails(cartDetails);

      axios
        .post(import.meta.env.VITE_BACKEND_URL + "/api/orders/quote", {
          orderedItems: cart,
        })
        .then((res) => {
          if (res.data.total != null) {
            setDiscountedTotal(res.data.total);
          } else {
            setDiscountedTotal(calculatedTotal);
          }
        })
        .catch((err) => {
          toast.error("Failed to fetch order quote. Please try again.");
          console.error(err);
          setDiscountedTotal(calculatedTotal);
        });
    };
    
    calculateOriginalTotal();
  }, [cart, navigate]);

  function validateInputs() {
    if (!name.trim()) {
      toast.error("Please enter your name.");
      return false;
    }
    if (!address.trim()) {
      toast.error("Please enter your address.");
      return false;
    }
    if (!phone.trim() || !/^\d{10}$/.test(phone)) {
      toast.error("Please enter a valid 10-digit phone number.");
      return false;
    }
    return true;
  }

  function prepareOrder() {
    if (!validateInputs()) return;

    const order = {
      orderedItems: cartWithDetails, 
      name,
      address,
      phone,
      amount: discountedTotal * 100, 
    };

    setOrderData(order);
    setShowPayment(true);
  }

  const handlePaymentSuccess = async (paymentIntent) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("You must be logged in to place an order.");
        return;
      }

      const completeOrderData = {
        ...orderData,
        paymentIntentId: paymentIntent.id,
        paymentStatus: paymentIntent.status,
        email: paymentIntent.email,
        total: discountedTotal,
        discount: originalTotal - discountedTotal > 0 ? originalTotal - discountedTotal : 0 
      };

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/orders`,
        completeOrderData,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      toast.success("Order placed successfully!");
      navigate("/order-confirmation", { 
        state: { 
          orderId: response.data.order.orderId 
        } 
      });
    } catch (err) {
      console.error("Order placement error:", err);
      toast.error("Payment succeeded but order creation failed. Please contact support.");
    }
  };

  if (!cart) {
    return null;
  }

  const discountAmount = originalTotal - discountedTotal;
  const hasDiscount = discountAmount > 0;

  return (
    <div className="container mx-auto px-4 py-8 bg-gradient-to-b from-white to-pink-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        {showPayment ? "Secure Payment" : "Shipping Details"}
      </h1>
      
      {showPayment ? (
        <div className="flex justify-center">
          <div className="w-full max-w-xl bg-white rounded-xl shadow-md p-6 border border-pink-100">
            <div className="flex items-center justify-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Payment Information</h2>
            </div>
            
            <StripePayment 
              orderData={orderData} 
              onSuccess={handlePaymentSuccess} 
            />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-md p-6 border border-pink-100">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center mr-3">
                <FiUser className="text-pink-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiUser className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2
                     focus:ring-pink-500 focus:border-pink-500 transition-colors"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMapPin className="text-gray-400" />
                  </div>
                   <input
                    type="text"
                    className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2
                     focus:ring-pink-500 focus:border-pink-500 transition-colors"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter your complete delivery address"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiPhone className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter your 10-digit phone number"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-md p-6 border border-pink-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <FiFileText className="mr-2 text-pink-600" />
                Order Summary
              </h2>
              <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
                {cartWithDetails.map((item) => (
                  <CartCard
                    key={item.productId}
                    productId={item.productId}
                    qty={item.qty}
                    product={item} 
                  />
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 border border-pink-100">
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium">LKR {originalTotal.toFixed(2)}</span>
                </div>
                
             
                <div className="border-t border-gray-200 pt-3 flex justify-between text-lg font-bold">
                  <span className="text-gray-900">Total Amount:</span>
                  <span className="text-pink-600">LKR {discountedTotal.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={prepareOrder}
                className="w-full bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-700 hover:to-pink-800 text-white font-bold 
                py-3 px-3 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center"
              >
                Pay LKR {discountedTotal.toFixed(2)}
              </button>
              
              <p className="text-xs text-center text-gray-500 mt-4">
                Your personal data will be used to process your order, support your experience throughout this website, and for other purposes described in our privacy policy.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}