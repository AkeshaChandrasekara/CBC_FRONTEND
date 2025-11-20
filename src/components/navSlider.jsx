import { IoMdClose } from "react-icons/io";
import { Link } from "react-router-dom";
import { FiUser, FiShoppingCart, FiHeart, FiLogOut, FiShoppingBag, FiMail, FiPhone } from "react-icons/fi";
import { getWishlistCount } from "../utils/wishlistFunction";
import { loadCart } from "../utils/cartFunction";
import { useState, useEffect } from "react";
import axios from "axios";

export default function NavSlider({ closeSlider }) {
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [ordersCount, setOrdersCount] = useState(0);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const cart = loadCart();
    const count = cart.reduce((total, item) => total + item.qty, 0);
    setCartCount(count);
    
    setWishlistCount(getWishlistCount());

    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setUser(null);
          return;
        }

        const response = await axios.get(import.meta.env.VITE_BACKEND_URL + "/api/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setUser(null);
      }
    };

    const fetchOrdersCount = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setOrdersCount(0);
          return;
        }

        const response = await axios.get(import.meta.env.VITE_BACKEND_URL + "/api/orders", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const orders = response.data;
        setOrdersCount(Array.isArray(orders) ? orders.length : 0);
      } catch (error) {
        console.error("Error fetching orders count:", error);
        setOrdersCount(0);
      }
    };

    fetchUserData();
    fetchOrdersCount();

    const handleCartUpdate = () => {
      const updatedCart = loadCart();
      const updatedCount = updatedCart.reduce((total, item) => total + item.qty, 0);
      setCartCount(updatedCount);
    };

    const handleWishlistUpdate = () => {
      setWishlistCount(getWishlistCount());
    };

    window.addEventListener('cartUpdated', handleCartUpdate);
    window.addEventListener('wishlistUpdated', handleWishlistUpdate);

    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
      window.removeEventListener('wishlistUpdated', handleWishlistUpdate);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    window.location.href = "/";
    closeSlider();
  };

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={closeSlider}
      ></div>
      
      <div className="absolute right-0 w-80 h-full bg-white shadow-xl transform transition-transform duration-300 ease-in-out">
        
        <div className="flex justify-between items-center p-5 border-b border-gray-200 bg-white">
          <Link to="/" onClick={closeSlider} className="flex items-center">
            <img
              src="/cbclgo.png"
              className="h-10 object-contain"
              alt="Crystal Beauty Clear Logo"
            />
          </Link>
          <IoMdClose
            onClick={closeSlider}
            className="text-2xl cursor-pointer text-gray-700 hover:text-pink-600 transition-colors"
          />
        </div>
        
        <div className="p-4 border-b border-gray-100 bg-gray-50">
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <FiMail className="text-pink-600 text-sm flex-shrink-0" />
              <span className="text-sm text-gray-700">info@crystalbeauty.com</span>
            </div>
            
            <div className="flex items-center space-x-3">
              <FiPhone className="text-pink-600 text-sm flex-shrink-0" />
              <span className="text-sm text-gray-700">+94 11 222 3333</span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col p-5 space-y-4 overflow-y-auto h-full pb-28">
          <Link
            to="/"
            onClick={closeSlider}
            className="text-gray-700 font-medium text-lg hover:text-pink-600 transition-colors duration-300 py-3 border-b border-gray-100 flex items-center"
          >
            Home
          </Link>
          
          <Link
            to="/products"
            onClick={closeSlider}
            className="text-gray-700 font-medium text-lg hover:text-pink-600 transition-colors duration-300 py-3 border-b border-gray-100 flex items-center"
          >
            Products
          </Link>
          
          <Link
            to="/about"
            onClick={closeSlider}
            className="text-gray-700 font-medium text-lg hover:text-pink-600 transition-colors duration-300 py-3 border-b border-gray-100 flex items-center"
          >
            About Us
          </Link>
          
          <Link
            to="/contact"
            onClick={closeSlider}
            className="text-gray-700 font-medium text-lg hover:text-pink-600 transition-colors duration-300 py-3 border-b border-gray-100 flex items-center"
          >
            Contact Us
          </Link>
          
          <div className="pt-4 border-t border-gray-200 mt-4 space-y-4">
            
            <Link
              to="/orders"
              onClick={closeSlider}
              className="flex items-center justify-between text-gray-700 font-medium text-lg hover:text-pink-600 transition-colors duration-300 py-3 px-2 rounded-lg hover:bg-pink-50"
            >
              <div className="flex items-center">
                <FiShoppingBag className="mr-3 text-xl" />
                Orders
              </div>
              {ordersCount > 0 && (
                <span className="w-6 h-6 bg-pink-500 text-white text-xs rounded-full flex items-center justify-center">
                  {ordersCount}
                </span>
              )}
            </Link>

            <Link
              to="/wishlist"
              onClick={closeSlider}
              className="flex items-center justify-between text-gray-700 font-medium text-lg hover:text-pink-600 transition-colors duration-300 py-3 px-2 rounded-lg hover:bg-pink-50"
            >
              <div className="flex items-center">
                <FiHeart className="mr-3 text-xl" />
                Wishlist
              </div>
              {wishlistCount > 0 && (
                <span className="w-6 h-6 bg-pink-500 text-white text-xs rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>
            
            <Link
              to="/cart"
              onClick={closeSlider}
              className="flex items-center justify-between text-gray-700 font-medium text-lg hover:text-pink-600 transition-colors duration-300 py-3 px-2 rounded-lg hover:bg-pink-50"
            >
              <div className="flex items-center">
                <FiShoppingCart className="mr-3 text-xl" />
                Cart
              </div>
              {cartCount > 0 && (
                <span className="w-6 h-6 bg-pink-500 text-white text-xs rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            
            {user ? (
              <div className="mt-6 space-y-3">
                <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-pink-500 to-pink-600 text-white font-medium rounded-lg">
                  <div className="flex items-center">
                    <FiUser className="mr-2" />
                    <span>Hi, {user.firstName}</span>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center px-4 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-all duration-300"
                >
                  <FiLogOut className="mr-2" />
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={closeSlider}
                className="flex items-center justify-center mt-6 px-4 py-3 bg-gradient-to-r from-pink-500 to-pink-600 text-white font-medium rounded-lg text-center hover:from-pink-600 hover:to-pink-700 transition-all duration-300"
              >
                <FiUser className="mr-2" />
                Login 
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}