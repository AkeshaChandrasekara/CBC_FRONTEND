import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiEye, FiEdit, FiX, FiCheck, FiTruck, FiClock, FiAlertCircle } from "react-icons/fi";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [updateData, setUpdateData] = useState({ status: "", notes: "" });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(res.data);
    } catch (err) {
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = (items) => items.reduce((total, item) => total + item.price * item.quantity, 0);

  const getStatusBadge = (status) => {
    const statusStyles = {
      preparing: "bg-yellow-100 text-yellow-800",
      cancelled: "bg-red-100 text-red-800",
      delivered: "bg-green-100 text-green-800",
      completed: "bg-blue-100 text-blue-800",
      paused: "bg-purple-100 text-purple-800",
      pended: "bg-gray-100 text-gray-800"
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[status] || "bg-gray-100"}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const handleUpdate = async () => {
    const token = localStorage.getItem("token");
    if (!token) return toast.error("Unauthorized");

    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/orders/${selectedOrder.orderId}`,
        { status: updateData.status, notes: updateData.notes },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      toast.success("Order updated successfully");
      setOrders(orders.map(order => 
        order.orderId === selectedOrder.orderId ? 
        { ...order, status: updateData.status, notes: updateData.notes } : order
      ));
      closeModals();
    } catch (err) {
      toast.error("Update failed");
    }
  };

  const closeModals = () => {
    setSelectedOrder(null);
    setUpdateModalVisible(false);
    setDetailModalVisible(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 md:mb-6 gap-3">
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">Order Management</h1>
          <div className="flex space-x-2">
            <button className="px-3 py-1 md:px-4 md:py-2 bg-white border border-gray-300 rounded-lg text-xs md:text-sm font-medium hover:bg-gray-50">
              Export
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-6 md:p-8 text-center">
              <div className="animate-spin rounded-full h-6 w-6 md:h-8 md:w-8 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-2 text-sm md:text-base text-gray-600">Loading orders...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="p-6 md:p-8 text-center">
              <FiAlertCircle className="mx-auto h-8 w-8 md:h-12 md:w-12 text-gray-400" />
              <h3 className="mt-2 text-sm md:text-base font-medium text-gray-900">No orders found</h3>
              <p className="mt-1 text-xs md:text-sm text-gray-500">All new orders will appear here</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-3 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th scope="col" className="px-3 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                      Customer
                    </th>
                    <th scope="col" className="px-3 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                      Date
                    </th>
                    <th scope="col" className="px-3 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-3 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th scope="col" className="px-3 py-2 md:px-6 md:py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map((order) => (
                    <tr key={order.orderId} className="hover:bg-gray-50">
                      <td className="px-3 py-3 md:px-6 md:py-4 whitespace-nowrap text-xs md:text-sm font-medium text-gray-900">
                        #{order.orderId.slice(0, 8)}
                      </td>
                      <td className="px-3 py-3 md:px-6 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-500 hidden sm:table-cell">
                        {order.name}
                      </td>
                      <td className="px-3 py-3 md:px-6 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-500 hidden md:table-cell">
                        {new Date(order.date).toLocaleDateString()}
                      </td>
                      <td className="px-3 py-3 md:px-6 md:py-4 whitespace-nowrap">
                        {getStatusBadge(order.status)}
                      </td>
                      <td className="px-3 py-3 md:px-6 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-900">
                        LKR {calculateTotal(order.orderedItems).toFixed(2)}
                      </td>
                      <td className="px-3 py-3 md:px-6 md:py-4 whitespace-nowrap text-right text-xs md:text-sm font-medium">
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            setDetailModalVisible(true);
                          }}
                          className="text-blue-600 hover:text-blue-900 mr-2 md:mr-4"
                        >
                          <FiEye className="inline mr-1" /> <span className="hidden sm:inline">View</span>
                        </button>
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            setUpdateData({ status: order.status, notes: order.notes || "" });
                            setUpdateModalVisible(true);
                          }}
                          className="text-green-600 hover:text-green-900"
                        >
                          <FiEdit className="inline mr-1" /> <span className="hidden sm:inline">Update</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {detailModalVisible && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-4 md:p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-lg md:text-xl font-bold text-gray-800">Order Details</h2>
                <button onClick={closeModals} className="text-gray-400 hover:text-gray-500">
                  <FiX className="h-5 w-5 md:h-6 md:w-6" />
                </button>
              </div>
              <p className="text-xs md:text-sm text-gray-500 mt-1">#{selectedOrder.orderId}</p>
            </div>

            <div className="p-4 md:p-6 space-y-4 md:space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <h3 className="text-xs md:text-sm font-medium text-gray-500 mb-1 md:mb-2">CUSTOMER INFORMATION</h3>
                  <div className="space-y-1 md:space-y-2">
                    <p className="text-xs md:text-sm"><span className="font-medium">Name:</span> {selectedOrder.name}</p>
                    <p className="text-xs md:text-sm"><span className="font-medium">Phone:</span> {selectedOrder.phone}</p>
                    <p className="text-xs md:text-sm"><span className="font-medium">Address:</span> {selectedOrder.address}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-xs md:text-sm font-medium text-gray-500 mb-1 md:mb-2">ORDER INFORMATION</h3>
                  <div className="space-y-1 md:space-y-2">
                    <p className="text-xs md:text-sm"><span className="font-medium">Date:</span> {new Date(selectedOrder.date).toLocaleString()}</p>
                    <p className="text-xs md:text-sm"><span className="font-medium">Status:</span> {getStatusBadge(selectedOrder.status)}</p>
                    <p className="text-xs md:text-sm"><span className="font-medium">Notes:</span> {selectedOrder.notes || "None"}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xs md:text-sm font-medium text-gray-500 mb-2 md:mb-4">ORDER ITEMS</h3>
                <div className="space-y-3 md:space-y-4">
                  {selectedOrder.orderedItems.map((item, index) => (
                    <div key={index} className="flex items-start border-b border-gray-100 pb-3 md:pb-4">
                      <img src={item.image} alt={item.name} className="w-12 h-12 md:w-16 md:h-16 rounded-md object-cover mr-3 md:mr-4" />
                      <div className="flex-1">
                        <p className="text-xs md:text-sm font-medium line-clamp-1">{item.name}</p>
                        <p className="text-xs md:text-sm text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs md:text-sm font-medium">LKR {(item.price * item.quantity).toFixed(2)}</p>
                        <p className="text-2xs md:text-xs text-gray-500">LKR {item.price.toFixed(2)} each</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-200 pt-3 md:pt-4">
                <div className="flex justify-between">
                  <span className="text-xs md:text-sm font-medium">Subtotal</span>
                  <span className="text-xs md:text-sm">LKR {calculateTotal(selectedOrder.orderedItems).toFixed(2)}</span>
                </div>
                <div className="flex justify-between mt-1 md:mt-2">
                  <span className="text-xs md:text-sm font-medium">Shipping</span>
                  <span className="text-xs md:text-sm">LKR 0.00</span>
                </div>
                <div className="flex justify-between mt-1 md:mt-2 text-sm md:text-base font-bold">
                  <span>Total</span>
                  <span>LKR {calculateTotal(selectedOrder.orderedItems).toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="p-3 md:p-4 border-t border-gray-200 flex justify-end">
              <button
                onClick={closeModals}
                className="px-3 py-1 md:px-4 md:py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-xs md:text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      

      {updateModalVisible && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="p-4 md:p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-lg md:text-xl font-bold text-gray-800">Update Order Status</h2>
                <button onClick={closeModals} className="text-gray-400 hover:text-gray-500">
                  <FiX className="h-5 w-5 md:h-6 md:w-6" />
                </button>
              </div>
              <p className="text-xs md:text-sm text-gray-500 mt-1">#{selectedOrder.orderId}</p>
            </div>

            <div className="p-4 md:p-6 space-y-4 md:space-y-6">
              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">Status</label>
                <select
                  value={updateData.status}
                  onChange={(e) => setUpdateData({ ...updateData, status: e.target.value })}
                  className="w-full p-2 md:p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-xs md:text-sm"
                >
                  <option value="preparing">Preparing</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="delivered">Delivered</option>
                  <option value="completed">Completed</option>
                  <option value="paused">Paused</option>
                  <option value="pended">Pended</option>
                </select>
              </div>

              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">Admin Notes</label>
                <textarea
                  value={updateData.notes}
                  onChange={(e) => setUpdateData({ ...updateData, notes: e.target.value })}
                  rows={3}
                  className="w-full p-2 md:p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-xs md:text-sm"
                  placeholder="Add any internal notes about this order..."
                />
              </div>
            </div>

            <div className="p-3 md:p-4 border-t border-gray-200 flex justify-end space-x-2 md:space-x-3">
              <button
                onClick={closeModals}
                className="px-3 py-1 md:px-4 md:py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-xs md:text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="px-3 py-1 md:px-4 md:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-xs md:text-sm"
              >
                Update Status
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}