import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useLocation } from "react-router-dom";
import { FiPackage, FiShoppingBag, FiTruck, FiCheckCircle, FiXCircle, FiClock, FiEye } from "react-icons/fi";

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
          // toast.success(`Order ${location.state.orderId} placed successfully!`);
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

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return "bg-green-100 text-green-800";
      case 'cancelled':
        return "bg-red-100 text-red-800";
      case 'processing':
        return "bg-blue-100 text-blue-800";
      case 'shipped':
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-gradient-to-b from-white to-pink-50 min-h-screen">

      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>

      {loading ? (
        <div className="bg-white rounded-xl shadow-md p-8 text-center border border-pink-100">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/4 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
          </div>
        </div>
      ) : orders.length === 0 ? (
          <div className="text-center py-12">
            <div className="flex items-center justify-center h-[12vh]">
              <div className="bg-white w-2/3 rounded-xl shadow-md p-6 text-center border border-pink-100">
          <FiShoppingBag className="text-3xl text-pink-600 mx-auto mb-2" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No orders yet</h3>
          <p className="text-gray-600 mb-6">Start shopping to see your orders here</p>
          <button
            onClick={() => window.location.href = '/products'}
            className="bg-gradient-to-r from-pink-600 to-pink-700 text-white font-medium py-2 
                  px-4 rounded-lg hover:from-pink-700 hover:to-pink-800 transition-all duration-300"
          >
           
            Start Shopping
          </button>
        </div>
        </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-pink-100">
  
          <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-pink-100 font-semibold text-gray-700">
            <div className="col-span-2">Order ID</div>
            <div className="col-span-2">Date</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2">Items</div>
            <div className="col-span-2">Total</div>
            <div className="col-span-2 text-right">Actions</div>
          </div>
          
      
          <div className="divide-y divide-gray-100">
            {orders.map((order) => (
              <div key={order.orderId} className="grid grid-cols-12 gap-4 px-6 py-4 items-center
               hover:bg-pink-50 transition-colors duration-200">
                <div className="col-span-2 font-medium text-gray-900">{order.orderId}</div>
                <div className="col-span-2 text-gray-700">
                  {new Date(order.date).toLocaleDateString()}
                </div>
                <div className="col-span-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    {order.status || "Pending"}
                  </span>
                </div>
                <div className="col-span-2 text-gray-700">
                  {order.orderedItems.length} item{order.orderedItems.length !== 1 ? 's' : ''}
                </div>
                <div className="col-span-2">
                  <p className="font-bold text-black">
                    LKR {(getAmountPaid(order) || 0).toFixed(2)}
                  </p>
                  {calculateDiscount(order) > 0 && (
                    <p className="text-xs text-green-600">
                      Saved LKR {calculateDiscount(order).toFixed(2)}
                    </p>
                  )}
                </div>
                <div className="col-span-2 text-right">
                  <button 
                    onClick={() => handleRowClick(order)}
                    className="bg-pink-500 hover:bg-pink-600 text-white font-medium text-sm py-1 px-3 rounded-lg transition-colors duration-200 inline-flex items-center"
                  >
                    <FiEye className="mr-1" />
                    View 
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-2xl rounded-lg shadow-sm overflow-hidden border border-pink-100">
            <div className="bg-gradient-to-r from-pink-600 to-pink-700 p-6 text-white">
              <div className="flex justify-between items-start">
                <h2 className="text-xl font-bold">Order Details</h2>
                <button
                  className="text-white hover:text-pink-200 transition-colors"
                  onClick={closeModal}
                >
                  <FiXCircle className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6">
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
                      className="w-16 h-16 object-cover rounded-lg mr-4 border border-gray-200"
                    />
                    <div className="flex-grow">
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <div className="grid grid-cols-2 gap-2 text-sm mt-1">
                        <div>
                          <span className="text-gray-500">Price: </span>
                          {item.lastPrice && item.lastPrice < item.price ? (
                            <>
                              <span className="text-pink-600 font-medium">LKR {item.lastPrice.toFixed(2)}</span>
                              <span className="text-gray-400 line-through ml-1">LKR {item.price.toFixed(2)}</span>
                            </>
                          ) : (
                            <span className="text-gray-900">LKR {item.price.toFixed(2)}</span>
                          )}
                        </div>
                        <div>
                          <span className="text-gray-500">Quantity: </span>
                          <span className="text-gray-900">{item.quantity}</span>
                        </div>
                        <div className="col-span-2">
                          <span className="text-gray-500">Subtotal: </span>
                          <span className="font-medium text-gray-900">
                            LKR {((item.lastPrice || item.price) * item.quantity).toFixed(2)}
                          </span>
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
                    <span className="text-gray-900">
                      LKR {calculateOriginalTotal(selectedOrder).toFixed(2)}
                    </span>
                  </div>
                  
                  {calculateDiscount(selectedOrder) > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Discount:</span>
                      <span className="text-green-600">
                        - LKR {calculateDiscount(selectedOrder).toFixed(2)}
                      </span>
                    </div>
                  )}
                  
                  <div className="border-t border-gray-200 pt-2 flex justify-between text-base">
                    <span className="font-bold text-gray-900">Amount Paid:</span>
                    <span className="font-bold text-pink-600">
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