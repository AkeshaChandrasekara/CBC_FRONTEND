import { FiHome, FiPackage, FiShoppingBag, FiUsers, FiSettings, FiLogOut } from 'react-icons/fi';
import { FaChartLine } from 'react-icons/fa';
import { Outlet, Link } from 'react-router-dom';

export default function AdminHomePage() {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-72 bg-gradient-to-b from-indigo-700 to-indigo-800 text-white shadow-xl">
        {/* Logo/Dashboard Header */}
        <div className="p-6 border-b border-indigo-600">
          <h1 className="text-2xl font-bold flex items-center">
            <FaChartLine className="mr-3 text-indigo-300" />
            <span>AdminPro</span>
          </h1>
        </div>

        {/* Navigation */}
        <nav className="p-4 mt-4">
          <ul className="space-y-1">
            <li>
              <Link to="dashboard" className="flex items-center p-4 rounded-lg hover:bg-indigo-600/50 transition-colors duration-200">
                <FiHome className="mr-3 text-lg" />
                <span className="font-medium">Dashboard</span>
              </Link>
            </li>
            <li>
              <Link to="products" className="flex items-center p-4 rounded-lg hover:bg-indigo-600/50 transition-colors duration-200">
                <FiPackage className="mr-3 text-lg" />
                <span>Products</span>
              </Link>
            </li>
            <li>
              <Link to="orders" className="flex items-center p-4 rounded-lg hover:bg-indigo-600/50 transition-colors duration-200">
                <FiShoppingBag className="mr-3 text-lg" />
                <span>Orders</span>
                <span className="ml-auto bg-amber-500 text-xs font-bold px-2 py-1 rounded-full">12</span>
              </Link>
            </li>
            <li>
              <Link to="customers" className="flex items-center p-4 rounded-lg hover:bg-indigo-600/50 transition-colors duration-200">
                <FiUsers className="mr-3 text-lg" />
                <span>Customers</span>
              </Link>
            </li>
          </ul>
        </nav>

        {/* Bottom Section */}
        <div className="absolute bottom-0 w-72 p-4 border-t border-indigo-600">
          <a href="#" className="flex items-center p-4 rounded-lg hover:bg-indigo-600/50 transition-colors duration-200">
            <FiSettings className="mr-3 text-lg" />
            <span>Settings</span>
          </a>
          <a href="#" className="flex items-center p-4 rounded-lg hover:bg-indigo-600/50 transition-colors duration-200 text-red-200 hover:text-white">
            <FiLogOut className="mr-3 text-lg" />
            <span>Logout</span>
          </a>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-8">
        <Outlet />
      </div>
    </div>
  );
}