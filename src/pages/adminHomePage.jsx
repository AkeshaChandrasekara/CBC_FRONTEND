import { Link, Route, Routes, useNavigate } from "react-router-dom";
import { BsGraphUp, BsBoxSeam, BsCart4, BsPeopleFill, BsGearFill, BsShieldLock } from "react-icons/bs";
import { FiLogOut } from "react-icons/fi";
import AdminProductsPage from "./admin/adminProductsPage";
import AddProductForm from "./admin/addProductForm";
import EditProductForm from "./admin/editProductForm";
import AdminOrdersPage from "./admin/adminOrderPage";
import AdminCustomersPage from "./admin/AdminCustomersPage"; 
import AddAdminForm from "./admin/AddAdminForm";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import AdminSettingsPage from "./admin/AdminSettingsPage";
import AdminAdminsPage from "./admin/AdminAdminsPage";

export default function AdminHomePage() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    customers: 0,
    revenue: 0
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
        fetchDashboardStats(token);
      }
    }).catch((err) => {
      console.error("User verification error:", err);
      toast.error("Session expired. Please login again.");
      localStorage.removeItem("token");
      navigate("/login");
    });
  }, [navigate]);

  const fetchDashboardStats = async (token) => {
    try {
      const [productsRes, ordersRes, customersRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/orders`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/users/all`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      const revenue = ordersRes.data.reduce((total, order) => {
        return total + order.orderedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      }, 0);

      setStats({
        products: productsRes.data.length,
        orders: ordersRes.data.length,
        customers: customersRes.data.filter(u => u.type === "customer").length,
        revenue: revenue
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleNavClick = (tab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-50">
   
      <div className="md:hidden bg-slate-900 p-4 flex justify-between items-center text-white">
        <div className="flex items-center">
          <img src="/logo.png" alt="Crystal Beauty Clear" className="h-10 rounded-full" />
          <h1 className="ml-3 text-lg font-bold">Admin Panel</h1>
        </div>
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-md text-white focus:outline-none"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>
    
      <div className={`${mobileMenuOpen ? 'block' : 'hidden'} md:block w-full md:w-64 bg-gradient-to-b from-slate-900 to-slate-800 text-white shadow-xl flex flex-col`}>
        <div className="p-6 flex items-center justify-center border-b border-slate-700 md:block">
          <div className="flex items-center">
            <img src="/logo.png" alt="Crystal Beauty Clear" className="h-12 rounded-full" />
            <h1 className="ml-3 text-xl font-bold hidden md:block">Admin Panel</h1>
          </div>
        </div>
        
        <div className="p-4 space-y-1 mt-6 flex-1">
          <Link 
            className={`flex items-center p-3 rounded-lg transition-colors duration-200 ${activeTab === 'dashboard' ? 'bg-slate-700 text-white' : 'text-gray-300 hover:bg-slate-700 hover:text-white'}`}
            to="/admin"
            onClick={() => handleNavClick('admin')}
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
            className={`flex items-center p-3 rounded-lg transition-colors duration-200 ${activeTab === 'admins' ? 'bg-slate-700 text-white' : 'text-gray-300 hover:bg-slate-700 hover:text-white'}`}
            to="/admin/admins"
            onClick={() => handleNavClick('admins')}
          >
            <BsShieldLock className="mr-3 text-yellow-400" /> 
            <span>Admins</span>
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
          <h2 className="text-lg md:text-xl font-semibold text-gray-800">
            {user?.name ? `Welcome back, ${user.name.split(' ')[0]}` : 'Admin Dashboard'}
          </h2>
          <div className="flex items-center space-x-4">
            <div className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-gradient-to-r from-yellow-500 to-yellow-600 flex items-center justify-center text-white font-bold shadow-md">
              {user?.name?.charAt(0).toUpperCase() || 'A'}
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4 md:p-6 bg-gray-100">
          {user != null ? (
            <Routes path="/*">
              <Route path="/" element={
                <div className="space-y-6">
                  <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
                      <h3 className="text-xl md:text-2xl font-bold text-gray-800">Dashboard Overview</h3>
                      <button 
                        onClick={() => fetchDashboardStats(localStorage.getItem("token"))}
                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
                      >
                        Refresh Data
                      </button>
                    </div>
        
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
                      <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 md:p-6 rounded-lg text-white">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs md:text-sm font-medium">Total Products</p>
                            <p className="text-2xl md:text-3xl font-bold mt-1">{stats.products}</p>
                          </div>
                          <BsBoxSeam className="text-xl md:text-2xl opacity-80" />
                        </div>
                        <div className="mt-4">
                          <div className="h-1 bg-blue-400 rounded-full">
                            <div className="h-1 bg-white rounded-full w-3/4"></div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 md:p-6 rounded-lg text-white">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs md:text-sm font-medium">Total Orders</p>
                            <p className="text-2xl md:text-3xl font-bold mt-1">{stats.orders}</p>
                          </div>
                          <BsCart4 className="text-xl md:text-2xl opacity-80" />
                        </div>
                        <div className="mt-4">
                          <div className="h-1 bg-green-400 rounded-full">
                            <div className="h-1 bg-white rounded-full w-2/3"></div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-4 md:p-6 rounded-lg text-white">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs md:text-sm font-medium">Total Customers</p>
                            <p className="text-2xl md:text-3xl font-bold mt-1">{stats.customers}</p>
                          </div>
                          <BsPeopleFill className="text-xl md:text-2xl opacity-80" />
                        </div>
                        <div className="mt-4">
                          <div className="h-1 bg-purple-400 rounded-full">
                            <div className="h-1 bg-white rounded-full w-1/2"></div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 p-4 md:p-6 rounded-lg text-white">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs md:text-sm font-medium">Total Revenue</p>
                            <p className="text-2xl md:text-3xl font-bold mt-1">Rs{stats.revenue.toFixed(2)}</p>
                          </div>
                          <BsGraphUp className="text-xl md:text-2xl opacity-80" />
                        </div>
                        <div className="mt-4">
                          <div className="h-1 bg-yellow-400 rounded-full">
                            <div className="h-1 bg-white rounded-full w-4/5"></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4 md:p-6">
                      <h4 className="text-base md:text-lg font-semibold text-gray-800 mb-4">Recent Activity</h4>
                      <div className="space-y-4">
                        <div className="flex items-start">
                          <div className="flex-shrink-0 h-8 w-8 md:h-10 md:w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                            <BsCart4 className="text-sm md:text-base" />
                          </div>
                          <div className="ml-3 md:ml-4">
                            <p className="text-xs md:text-sm font-medium text-gray-900">New order received</p>
                            <p className="text-xs md:text-sm text-gray-500">Order #CBC1234 for Rs1,250.00</p>
                            <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <div className="flex-shrink-0 h-8 w-8 md:h-10 md:w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                            <BsPeopleFill className="text-sm md:text-base" />
                          </div>
                          <div className="ml-3 md:ml-4">
                            <p className="text-xs md:text-sm font-medium text-gray-900">New customer registered</p>
                            <p className="text-xs md:text-sm text-gray-500">sachi@gmail.com</p>
                            <p className="text-xs text-gray-400 mt-1">5 hours ago</p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <div className="flex-shrink-0 h-8 w-8 md:h-10 md:w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                            <BsBoxSeam className="text-sm md:text-base" />
                          </div>
                          <div className="ml-3 md:ml-4">
                            <p className="text-xs md:text-sm font-medium text-gray-900">Product stock updated</p>
                            <p className="text-xs md:text-sm text-gray-500">Vitamin C Serum stock increased to 50</p>
                            <p className="text-xs text-gray-400 mt-1">1 day ago</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              } />
              <Route path="/products" element={<AdminProductsPage />} />
              <Route path="/products/addProduct" element={<AddProductForm />} />
              <Route path="/products/editProduct" element={<EditProductForm />} />
              <Route path="/orders" element={<AdminOrdersPage />} />
              <Route path="/customers" element={<AdminCustomersPage />} />
              <Route path="/admins" element={<AdminAdminsPage />} />
              <Route path="/settings" element={<AdminSettingsPage />} />
              <Route path="/admins/add" element={<AddAdminForm />} />
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