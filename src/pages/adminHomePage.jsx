import { Link, Route, Routes, useNavigate } from "react-router-dom";
import { BsGraphUp, BsBoxSeam, BsCart4, BsPeopleFill, BsGearFill, BsShieldLock, BsCurrencyDollar, BsArrowUpRight, BsArrowDownRight } from "react-icons/bs";
import { FiLogOut, FiTrendingUp, FiActivity } from "react-icons/fi";
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
    revenue: 0,
    monthlyGrowth: 12.5,
    conversionRate: 4.2
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [recentOrders, setRecentOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
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
        fetchRecentData(token);
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
        revenue: revenue,
        monthlyGrowth: 12.5,
        conversionRate: 4.2
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const fetchRecentData = async (token) => {
    try {
      
      setRecentOrders([
        { id: 1, customer: "Sachini Perera", amount: 12500, status: "completed", date: "2 hours ago" },
        { id: 2, customer: "Nethmi Silva", amount: 8500, status: "processing", date: "5 hours ago" },
        { id: 3, customer: "Kamal Fernando", amount: 15200, status: "completed", date: "1 day ago" },
        { id: 4, customer: "Priya Rajapaksa", amount: 9800, status: "pending", date: "1 day ago" }
      ]);

      setTopProducts([
        { name: "Vitamin C Serum", sales: 42, revenue: 52500 },
        { name: "Crystal Face Cream", sales: 38, revenue: 45600 },
        { name: "Rose Quartz Roller", sales: 29, revenue: 34800 },
        { name: "Hyaluronic Acid Serum", sales: 25, revenue: 30000 }
      ]);
    } catch (error) {
      console.error("Error fetching recent data:", error);
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

  const getStatusColor = (status) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800";
      case "processing": return "bg-blue-100 text-blue-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-50">
     
      <div className="md:hidden bg-[#8B2252] p-4 flex justify-between items-center text-white shadow-md">
        <div className="flex items-center">
          <img src="/cbclgo.png" alt="Crystal Beauty Clear" className="h-10 rounded-full" />
          <h1 className="ml-3 text-lg font-semibold">Admin Panel</h1>
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
    
      <div className={`${mobileMenuOpen ? 'block' : 'hidden'} md:block w-full md:w-64 bg-[#8B2252] text-white shadow-xl flex flex-col`}>
        <div className="p-6 flex items-center justify-center border-b border-[#A73275] md:block">
          <div className="flex items-center">
            <img src="/cbclgo.png" alt="Crystal Beauty Clear" className="h-12 rounded-full" />
            <h1 className="ml-3 text-xl font-semibold hidden md:block">Admin Panel</h1>
          </div>
        </div>
        
        <div className="p-4 space-y-1 mt-6 flex-1">
          <Link 
            className={`flex items-center p-3 rounded-lg transition-colors duration-200 ${activeTab === 'dashboard' ? 'bg-[#A73275] text-white' : 'text-gray-100 hover:bg-[#A73275] hover:text-white'}`}
            to="/admin"
            onClick={() => handleNavClick('admin')}
          >
            <BsGraphUp className="mr-3 text-pink-200" /> 
            <span className="font-semibold">Dashboard</span>
          </Link>

           <Link 
            className={`flex items-center p-3 rounded-lg transition-colors duration-200 ${activeTab === 'orders' ? 'bg-[#A73275] text-white' : 'text-gray-100 hover:bg-[#A73275] hover:text-white'}`}
            to="/admin/orders"
            onClick={() => handleNavClick('orders')}
          >
            <BsCart4 className="mr-3 text-pink-200" /> 
            <span className="font-semibold">Orders</span>
          </Link>

          <Link 
            className={`flex items-center p-3 rounded-lg transition-colors duration-200 ${activeTab === 'products' ? 'bg-[#A73275] text-white' : 'text-gray-100 hover:bg-[#A73275] hover:text-white'}`}
            to="/admin/products"
            onClick={() => handleNavClick('products')}
          >
            <BsBoxSeam className="mr-3 text-pink-200" /> 
            <span className="font-semibold">Products</span>
          </Link>

          <Link 
            className={`flex items-center p-3 rounded-lg transition-colors duration-200 ${activeTab === 'customers' ? 'bg-[#A73275] text-white' : 'text-gray-100 hover:bg-[#A73275] hover:text-white'}`}
            to="/admin/customers"
            onClick={() => handleNavClick('customers')}
          >
            <BsPeopleFill className="mr-3 text-pink-200" /> 
            <span className="font-semibold">Customers</span>
          </Link>

          <Link 
            className={`flex items-center p-3 rounded-lg transition-colors duration-200 ${activeTab === 'admins' ? 'bg-[#A73275] text-white' : 'text-gray-100 hover:bg-[#A73275] hover:text-white'}`}
            to="/admin/admins"
            onClick={() => handleNavClick('admins')}
          >
            <BsShieldLock className="mr-3 text-pink-200" /> 
            <span className="font-semibold">Admins</span>
          </Link>

          <Link 
            className={`flex items-center p-3 rounded-lg transition-colors duration-200 ${activeTab === 'settings' ? 'bg-[#A73275] text-white' : 'text-gray-100 hover:bg-[#A73275] hover:text-white'}`}
            to="/admin/settings"
            onClick={() => handleNavClick('settings')}
          >
            <BsGearFill className="mr-3 text-pink-200" /> 
            <span className="font-semibold">Settings</span>
          </Link>
        </div>

        <div className="p-4 border-t border-[#A73275]">
          <button 
            onClick={handleLogout}
            className="flex items-center justify-center w-full p-3 rounded-lg bg-[#A73275] hover:bg-[#C2185B] transition-colors duration-200 text-white font-semibold"
          >
            <FiLogOut className="mr-2 text-pink-200" />
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
            <div className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-gradient-to-r from-pink-500 to-pink-600 flex items-center justify-center text-white font-bold shadow-md">
              {user?.name?.charAt(0).toUpperCase() || 'A'}
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4 md:p-6 bg-gray-100">
          {user != null ? (
            <Routes path="/*">
              <Route path="/" element={
                <div className="space-y-6">
             
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                    <div>
                      <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Dashboard Overview</h1>
                      <p className="text-gray-600 mt-1">Welcome back, here's what's happening today</p>
                    </div>
                    <button 
                      onClick={() => fetchDashboardStats(localStorage.getItem("token"))}
                      className="px-4 py-2 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white rounded-lg text-sm font-medium transition-all duration-300 shadow-md hover:shadow-lg flex items-center"
                    >
                      <FiActivity className="mr-2" />
                      Refresh Data
                    </button>
                  </div>
        
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                          <p className="text-2xl font-bold text-gray-800 mt-1">Rs {stats.revenue.toFixed(2)}</p>
                          <div className="flex items-center mt-2">
                            <BsArrowUpRight className="text-green-500 mr-1" />
                            <span className="text-sm text-green-500 font-medium">{stats.monthlyGrowth}% this month</span>
                          </div>
                        </div>
                        <div className="h-12 w-12 rounded-lg bg-pink-100 flex items-center justify-center">
                          <BsCurrencyDollar className="text-pink-600 text-xl" />
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Total Orders</p>
                          <p className="text-2xl font-bold text-gray-800 mt-1">{stats.orders}</p>
                          <div className="flex items-center mt-2">
                            <BsArrowUpRight className="text-green-500 mr-1" />
                            <span className="text-sm text-green-500 font-medium">8.2% this month</span>
                          </div>
                        </div>
                        <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                          <BsCart4 className="text-blue-600 text-xl" />
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Total Customers</p>
                          <p className="text-2xl font-bold text-gray-800 mt-1">{stats.customers}</p>
                          <div className="flex items-center mt-2">
                            <BsArrowUpRight className="text-green-500 mr-1" />
                            <span className="text-sm text-green-500 font-medium">5.1% this month</span>
                          </div>
                        </div>
                        <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
                          <BsPeopleFill className="text-green-600 text-xl" />
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                          <p className="text-2xl font-bold text-gray-800 mt-1">{stats.conversionRate}%</p>
                          <div className="flex items-center mt-2">
                            <BsArrowDownRight className="text-red-500 mr-1" />
                            <span className="text-sm text-red-500 font-medium">1.2% this month</span>
                          </div>
                        </div>
                        <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center">
                          <FiTrendingUp className="text-purple-600 text-xl" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
               
                    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                      <div className="flex justify-between items-center mb-5">
                        <h3 className="text-lg font-semibold text-gray-800">Revenue Overview</h3>
                        <select className="text-sm border border-gray-200 rounded-lg px-3 py-1">
                          <option>Last 7 days</option>
                          <option>Last 30 days</option>
                          <option>Last 90 days</option>
                        </select>
                      </div>
                      <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                        <div className="text-center text-gray-500">
                          <BsGraphUp className="text-3xl mx-auto mb-2 text-pink-500" />
                          <p>Revenue chart will be displayed here</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                      <div className="flex justify-between items-center mb-5">
                        <h3 className="text-lg font-semibold text-gray-800">Recent Orders</h3>
                        <Link to="/admin/orders" className="text-pink-600 text-sm font-medium hover:text-pink-700">
                          View all
                        </Link>
                      </div>
                      <div className="space-y-4">
                        {recentOrders.map((order) => (
                          <div key={order.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-pink-50 transition-colors">
                            <div className="flex items-center">
                              <div className="h-10 w-10 rounded-full bg-pink-100 flex items-center justify-center text-pink-600">
                                <BsCart4 className="text-sm" />
                              </div>
                              <div className="ml-4">
                                <p className="text-sm font-medium text-gray-900">Order #{order.id}</p>
                                <p className="text-xs text-gray-500">{order.customer}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(order.status)}`}>
                                {order.status}
                              </span>
                              <p className="text-sm font-medium text-gray-900 mt-1">Rs {order.amount.toFixed(2)}</p>
                              <p className="text-xs text-gray-400">{order.date}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
                    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                      <div className="flex justify-between items-center mb-5">
                        <h3 className="text-lg font-semibold text-gray-800">Top Selling Products</h3>
                        <Link to="/admin/products" className="text-pink-600 text-sm font-medium hover:text-pink-700">
                          View all
                        </Link>
                      </div>
                      <div className="space-y-4">
                        {topProducts.map((product, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                                <BsBoxSeam className="text-sm" />
                              </div>
                              <div className="ml-4">
                                <p className="text-sm font-medium text-gray-900">{product.name}</p>
                                <p className="text-xs text-gray-500">{product.sales} units sold</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium text-gray-900">Rs {product.revenue.toFixed(2)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                      <h3 className="text-lg font-semibold text-gray-800 mb-5">Quick Actions</h3>
                      <div className="grid grid-cols-2 gap-3">
                        <Link 
                          to="/admin/products/addProduct" 
                          className="p-3 rounded-lg bg-pink-50 hover:bg-pink-100 border border-pink-100 text-center transition-colors"
                        >
                          <BsBoxSeam className="text-pink-600 text-xl mx-auto mb-2" />
                          <p className="text-sm font-medium text-pink-700">Add Product</p>
                        </Link>
                        <Link 
                          to="/admin/admins/add" 
                          className="p-3 rounded-lg bg-blue-50 hover:bg-blue-100 border border-blue-100 text-center transition-colors"
                        >
                          <BsShieldLock className="text-blue-600 text-xl mx-auto mb-2" />
                          <p className="text-sm font-medium text-blue-700">Add Admin</p>
                        </Link>
                        <Link 
                          to="/admin/orders" 
                          className="p-3 rounded-lg bg-green-50 hover:bg-green-100 border border-green-100 text-center transition-colors"
                        >
                          <BsCart4 className="text-green-600 text-xl mx-auto mb-2" />
                          <p className="text-sm font-medium text-green-700">View Orders</p>
                        </Link>
                        <Link 
                          to="/admin/settings" 
                          className="p-3 rounded-lg bg-purple-50 hover:bg-purple-100 border border-purple-100 text-center transition-colors"
                        >
                          <BsGearFill className="text-purple-600 text-xl mx-auto mb-2" />
                          <p className="text-sm font-medium text-purple-700">Settings</p>
                        </Link>
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
              <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-pink-500"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}