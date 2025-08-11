import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useLocation } from "react-router-dom";

export default function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to view orders");
      setLoading(false);
      return;
    }

    axios
      .get(import.meta.env.VITE_BACKEND_URL + "/api/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log("Fetched orders:", res.data); 
        setOrders(res.data);
        setLoading(false);
        if (location.state?.paymentSuccess) {
        //  toast.success(`Order ${location.state.orderId} placed successfully!`);
        }
      })
      .catch((err) => {
        toast.error("Failed to fetch orders. Please try again.");
        setLoading(false);
        console.error(err);
      });
  }, [location.state]);

  const getAmountPaid = (order) => {
    if (order.total !== undefined) {
      return order.total;
    }
    return order.orderedItems.reduce((sum, item) => sum + (item.lastPrice || item.price) * item.quantity, 0);
  };

  const calculateOriginalTotal = (order) => {
    return order.orderedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const calculateDiscount = (order) => {
    const original = calculateOriginalTotal(order);
    const paid = getAmountPaid(order) || 0; 
    return Math.max(0, original - paid);
  };

  const handleRowClick = (order) => {
    setSelectedOrder(order);
  };

  const closeModal = () => {
    setSelectedOrder(null);
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-white">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>

      {loading ? (
        <div className="bg-gray-50 rounded-lg shadow-sm p-6 text-center">
          <p className="text-gray-500">Loading orders...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-gray-50 rounded-lg shadow-sm p-6 text-center">
          <p className="text-gray-500">No orders found.</p>
        </div>
      ) : (
        <div className="bg-gray-50 rounded-lg shadow-sm p-6">
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.orderId}
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-100 cursor-pointer transition-colors duration-200"
                onClick={() => handleRowClick(order)}
              >
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Order ID</p>
                    <p className="font-medium text-gray-900">{order.orderId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <p className="font-medium text-gray-900">{order.status || "Pending"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="font-medium text-gray-900">
                      {new Date(order.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Amount Paid</p>
                    <p className="font-medium text-gray-900">LKR {(getAmountPaid(order) || 0).toFixed(2)}</p>
                    {calculateDiscount(order) > 0 && (
                      <p className="text-xs text-yellow-500">
                        You saved LKR {calculateDiscount(order).toFixed(2)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-50 w-full max-w-2xl rounded-lg shadow-sm overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-xl font-bold text-gray-900">Order Details</h2>
                <button
                  className="text-gray-500 hover:text-gray-700"
                  onClick={closeModal}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Order ID</p>
                    <p className="font-medium text-gray-900">{selectedOrder.orderId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <p className="font-medium text-gray-900">{selectedOrder.status || "Pending"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="font-medium text-gray-900">
                      {new Date(selectedOrder.date).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Customer</p>
                    <p className="font-medium text-gray-900">{selectedOrder.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Address</p>
                    <p className="font-medium text-gray-900">{selectedOrder.address}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium text-gray-900">{selectedOrder.phone}</p>
                  </div>
                </div>
              </div>

              <h3 className="text-lg font-bold text-gray-900 mt-6 mb-4">Ordered Items</h3>
              <div className="space-y-4">
                {selectedOrder.orderedItems.map((item, index) => (
                  <div key={index} className="flex items-start border-b border-gray-100 pb-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg mr-4"
                    />
                    <div className="flex-grow">
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <div className="grid grid-cols-2 gap-2 text-sm mt-1">
                        <div>
                          <span className="text-gray-500">Original Price:</span> LKR {item.price.toFixed(2)}
                        </div>
                        {item.lastPrice && item.lastPrice < item.price && (
                          <div>
                            <span className="text-gray-500">Discounted Price:</span> LKR {item.lastPrice.toFixed(2)}
                          </div>
                        )}
                        <div>
                          <span className="text-gray-500">Qty:</span> {item.quantity}
                        </div>
                        <div className="col-span-2">
                          <span className="text-gray-500">Subtotal:</span> LKR {((item.lastPrice || item.price) * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4 mt-6">
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Original Total:</span>
                    <span className="font-medium text-gray-900">
                      LKR {calculateOriginalTotal(selectedOrder).toFixed(2)}
                    </span>
                  </div>
                  {calculateDiscount(selectedOrder) > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Discount:</span>
                      <span className="text-yellow-500">
                        - LKR {calculateDiscount(selectedOrder).toFixed(2)}
                      </span>
                    </div>
                  )}
                  <div className="border-t border-gray-200 pt-2 flex justify-between text-base">
                    <span className="font-bold text-gray-900">Amount Paid:</span>
                    <span className="font-bold text-gray-900">
                      LKR {(getAmountPaid(selectedOrder) || 0).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}