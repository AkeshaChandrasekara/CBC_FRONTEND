import { IoMdClose } from "react-icons/io";
import { Link } from "react-router-dom";
import { FiUser, FiShoppingCart, FiHeart } from "react-icons/fi";
import { getWishlistCount } from "../utils/wishlistFunction";
import { loadCart } from "../utils/cartFunction";
import { useState, useEffect } from "react";

export default function NavSlider({ closeSlider }) {
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);

  useEffect(() => {
    
    const cart = loadCart();
    const count = cart.reduce((total, item) => total + item.qty, 0);
    setCartCount(count);
    
    setWishlistCount(getWishlistCount());
  }, []);

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
        
       
        <div className="flex flex-col p-5 space-y-6 overflow-y-auto h-full pb-28">
          <Link
            to="/"
            onClick={closeSlider}
            className="text-gray-700 font-medium text-lg hover:text-pink-600 transition-colors duration-300 py-2 border-b border-gray-100"
          >
            Home
          </Link>
          
          <Link
            to="/products"
            onClick={closeSlider}
            className="text-gray-700 font-medium text-lg hover:text-pink-600 transition-colors duration-300 py-2 border-b border-gray-100"
          >
            Products
          </Link>
          
          <Link
            to="/about"
            onClick={closeSlider}
            className="text-gray-700 font-medium text-lg hover:text-pink-600 transition-colors duration-300 py-2 border-b border-gray-100"
          >
            About Us
          </Link>
          
          <Link
            to="/contact"
            onClick={closeSlider}
            className="text-gray-700 font-medium text-lg hover:text-pink-600 transition-colors duration-300 py-2 border-b border-gray-100"
          >
            Contact Us
          </Link>
          
          <div className="pt-4 border-t border-gray-200 mt-4">
             <Link
                              to="/orders"
                              className="p-2 text-gray-600 hover:text-pink-600 transition-colors duration-300 relative group"
                            >
                              <FiShoppingBag className="text-xl" /> 
                              <span className="absolute -top-1 -right-1 w-4 h-4 bg-pink-500 text-white text-xs rounded-full flex items-center justify-center">
                                {ordersCount}
                              </span>
                            </Link>
            <Link
              to="/wishlist"
              onClick={closeSlider}
              className="flex items-center text-gray-700 font-medium text-lg hover:text-pink-600 transition-colors duration-300 py-3"
            >
              <FiHeart className="mr-3 text-xl" />
              Wishlist
              {wishlistCount > 0 && (
                <span className="ml-2 w-5 h-5 bg-pink-500 text-white text-xs rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>
            
            <Link
              to="/cart"
              onClick={closeSlider}
              className="flex items-center text-gray-700 font-medium text-lg hover:text-pink-600 transition-colors duration-300 py-3"
            >
              <FiShoppingCart className="mr-3 text-xl" />
              Cart
              {cartCount > 0 && (
                <span className="ml-2 w-5 h-5 bg-pink-500 text-white text-xs rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            
            <Link
              to="/login"
              onClick={closeSlider}
              className="flex items-center justify-center mt-6 px-4 py-3 bg-gradient-to-r from-pink-500 to-pink-600 text-white font-medium rounded-lg text-center hover:from-pink-600 hover:to-pink-700 transition-all duration-300"
            >
              <FiUser className="mr-2" />
              Login 
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}