import { Link, Route, Routes, useNavigate } from "react-router-dom";
import { BsGraphUp, BsBoxSeam, BsCart4, BsPeopleFill, BsGearFill } from "react-icons/bs";
import { FiLogOut } from "react-icons/fi";
import AdminProductsPage from "./admin/adminProductsPage";
import AddProductForm from "./admin/addProductForm";
import EditProductForm from "./admin/editProductForm";
import AdminOrdersPage from "./admin/adminOrderPage";
import AdminCustomersPage from "./admin/AdminCustomersPage"; 
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";

export default function AdminHomePage() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {      
      navigate("/login");
      return;
    }

    axios.get(import.meta.env.VITE_BACKEND_URL + "/api/users", {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }).then((res) => {
      if (res.data.type !== "admin") {
        toast.error("Unauthorized access");
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        setUser(res.data);
      }
    }).catch((err) => {
      console.error("User verification error:", err);
      toast.error("Session expired. Please login again.");
      localStorage.removeItem("token");
      navigate("/login");
    });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleNavClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="flex h-screen bg-gray-50">
   
      <div className="w-64 bg-gradient-to-b from-slate-900 to-slate-800 text-white shadow-xl flex flex-col">
        <div className="p-6 flex items-center justify-center border-b border-slate-700">
          <img src="/logo.png" alt="Crystal Beauty Clear" className="h-12 rounded-full" />
          <h1 className="ml-3 text-xl font-bold">Admin Panel</h1>
        </div>
        
        <div className="p-4 space-y-1 mt-6 flex-1">
          <Link 
            className={`flex items-center p-3 rounded-lg transition-colors duration-200 ${activeTab === 'dashboard' ? 'bg-slate-700 text-white' : 'text-gray-300 hover:bg-slate-700 hover:text-white'}`}
            to="/admin/dashboard"
            onClick={() => handleNavClick('dashboard')}
          >
            <BsGraphUp className="mr-3 text-yellow-400" /> 
            <span>Dashboard</span>
          </Link>

          <Link 
            className={`flex items-center p-3 rounded-lg transition-colors duration-200 ${activeTab === 'products' ? 'bg-slate-700 text-white' : 'text-gray-300 hover:bg-slate-700 hover:text-white'}`}
            to="/admin/products"
            onClick={() => handleNavClick('products')}
          >
            <BsBoxSeam className="mr-3 text-yellow-400" /> 
            <span>Products</span>
          </Link>

          <Link 
            className={`flex items-center p-3 rounded-lg transition-colors duration-200 ${activeTab === 'orders' ? 'bg-slate-700 text-white' : 'text-gray-300 hover:bg-slate-700 hover:text-white'}`}
            to="/admin/orders"
            onClick={() => handleNavClick('orders')}
          >
            <BsCart4 className="mr-3 text-yellow-400" /> 
            <span>Orders</span>
          </Link>

          <Link 
            className={`flex items-center p-3 rounded-lg transition-colors duration-200 ${activeTab === 'customers' ? 'bg-slate-700 text-white' : 'text-gray-300 hover:bg-slate-700 hover:text-white'}`}
            to="/admin/customers"
            onClick={() => handleNavClick('customers')}
          >
            <BsPeopleFill className="mr-3 text-yellow-400" /> 
            <span>Customers</span>
          </Link>

          <Link 
            className={`flex items-center p-3 rounded-lg transition-colors duration-200 ${activeTab === 'settings' ? 'bg-slate-700 text-white' : 'text-gray-300 hover:bg-slate-700 hover:text-white'}`}
            to="/admin/settings"
            onClick={() => handleNavClick('settings')}
          >
            <BsGearFill className="mr-3 text-yellow-400" /> 
            <span>Settings</span>
          </Link>
        </div>

        <div className="p-4 border-t border-slate-700">
          <button 
            onClick={handleLogout}
            className="flex items-center justify-center w-full p-2 rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors duration-200 text-white"
          >
            <FiLogOut className="mr-2 text-yellow-400" />
            <span className="truncate">Sign Out</span>
          </button>
        </div>
      </div>

     
      <div className="flex-1 flex flex-col overflow-hidden">
     
        <div className="bg-white shadow-sm p-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">
            {user?.name ? `Welcome back, ${user.name.split(' ')[0]}` : 'Admin Dashboard'}
          </h2>
          <div className="flex items-center space-x-4">
            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-yellow-500 to-yellow-600 flex items-center justify-center text-white font-bold shadow-md">
              {user?.name?.charAt(0).toUpperCase() || 'A'}
            </div>
          </div>
        </div>

     
        <div className="flex-1 overflow-auto p-6 bg-gray-100">
          {user != null ? (
            <Routes path="/*">
              <Route path="/" element={
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-800">Dashboard Overview</h3>
                    <button 
                      onClick={() => window.location.reload()}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
                    >
                      Refresh Data
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between">
                        <h4 className="text-gray-600 font-medium">Total Products</h4>
                        <BsBoxSeam className="text-yellow-500" />
                      </div>
                      <p className="text-3xl font-bold text-gray-800 mt-2">24</p>
                      <p className="text-sm text-gray-500 mt-1">+2 from last week</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between">
                        <h4 className="text-gray-600 font-medium">Pending Orders</h4>
                        <BsCart4 className="text-blue-500" />
                      </div>
                      <p className="text-3xl font-bold text-gray-800 mt-2">12</p>
                      <p className="text-sm text-gray-500 mt-1">+3 new today</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between">
                        <h4 className="text-gray-600 font-medium">New Customers</h4>
                        <BsPeopleFill className="text-green-500" />
                      </div>
                      <p className="text-3xl font-bold text-gray-800 mt-2">8</p>
                      <p className="text-sm text-gray-500 mt-1">30% increase</p>
                    </div>
                  </div>
                </div>
              } />
              <Route path="/products" element={<AdminProductsPage />} />
              <Route path="/products/addProduct" element={<AddProductForm />} />
              <Route path="/products/editProduct" element={<EditProductForm />} />
              <Route path="/orders" element={<AdminOrdersPage />} />
              <Route path="/customers" element={<AdminCustomersPage />} />
              <Route path="/*" element={<h1>404 not found the admin page</h1>} />
            </Routes>
          ) : (
            <div className="w-full h-full flex justify-center items-center">
              <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-yellow-500"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}