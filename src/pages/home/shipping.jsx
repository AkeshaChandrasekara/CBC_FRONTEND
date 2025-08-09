import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CartCard from "../../components/cartCard";
import toast from "react-hot-toast";
import axios from "axios";
import StripePayment from "../../components/StripePayment";

export default function ShippingPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const cart = location.state?.items;
  const [total, setTotal] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [orderData, setOrderData] = useState(null);
  const [showPayment, setShowPayment] = useState(false);

  useEffect(() => {
    if (!cart) {
      toast.error("No items received");
      navigate("/cart");
      return;
    }

    axios
      .post(import.meta.env.VITE_BACKEND_URL + "/api/orders/quote", {
        orderedItems: cart,
      })
      .then((res) => {
        if (res.data.total != null) {
          setTotal(res.data.total);
          setSubtotal(res.data.labeledTotal || res.data.total);
        }
      })
      .catch((err) => {
        toast.error("Failed to fetch order quote. Please try again.");
        console.error(err);
      });
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
      orderedItems: cart,
      name,
      address,
      phone,
      amount: subtotal * 100, 
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
        total: subtotal,
        discount: total - subtotal > 0 ? total - subtotal : 0 
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
      navigate("/orders", { 
        state: { 
          paymentSuccess: true,
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

  const discount = total - subtotal;

  return (
    <div className="container mx-auto px-4 py-8 bg-white">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        {showPayment ? "Payment" : "Shipping Details"}
      </h1>
      
      {showPayment ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-gray-50 rounded-lg shadow-sm p-6">
            <StripePayment 
              orderData={orderData} 
              onSuccess={handlePaymentSuccess} 
            />
          </div>
          
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
              <div className="space-y-4">
                {cart.map((item) => (
                  <CartCard
                    key={item.productId}
                    productId={item.productId}
                    qty={item.qty}
                  />
                ))}
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Original Total:</span>
                  <span className="font-medium">LKR. {total.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Discount:</span>
                    <span className="text-yellow-500">- LKR. {discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t border-gray-200 pt-2 flex justify-between text-base">
                  <span className="font-bold text-gray-900">Amount to Pay:</span>
                  <span className="font-bold text-gray-900">LKR. {subtotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-gray-50 rounded-lg shadow-sm p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <textarea
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                  rows="4"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter your complete address"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter your 10-digit phone number"
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
              <div className="space-y-4">
                {cart.map((item) => (
                  <CartCard
                    key={item.productId}
                    productId={item.productId}
                    qty={item.qty}
                  />
                ))}
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Price:</span>
                  <span className="font-medium">LKR. {total.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Discount:</span>
                    <span className="text-yellow-500">- LKR. {discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t border-gray-200 pt-2 flex justify-between text-base">
                  <span className="font-bold text-gray-900">Amount to Pay:</span>
                  <span className="font-bold text-gray-900">LKR. {subtotal.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={prepareOrder}
                className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-2 px-4 rounded-lg transition-colors duration-300 text-sm"
              >
                Pay LKR. {subtotal.toFixed(2)}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}