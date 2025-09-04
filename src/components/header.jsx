import { useState, useEffect } from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import { FiUser, FiShoppingCart, FiHeart } from "react-icons/fi";
import { Link } from "react-router-dom";
import NavSlider from "./navSlider";
import { loadCart, getCurrentUserEmail } from "../utils/cartFunction"; 
import axios from "axios";
import { getWishlistCount } from "../utils/wishlistFunction";

export default function Header() {
  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);

  useEffect(() => {
  
    updateCartCount();
  
  }, []);

  const updateCartCount = () => {
    const cart = loadCart();
    const count = cart.reduce((total, item) => total + item.qty, 0);
    setCartCount(count);
  };

  useEffect(() => {
  const updateWishlistCount = () => {
    setWishlistCount(getWishlistCount());
  };
  

  updateWishlistCount();
  
  window.addEventListener('wishlistUpdated', updateWishlistCount);
  
  return () => {
    window.removeEventListener('wishlistUpdated', updateWishlistCount);
  };
}, []);

  return (
    <>
      {isSliderOpen && <NavSlider closeSlider={() => setIsSliderOpen(false)} />}
      
      <div className="bg-gradient-to-r from-pink-600 to-pink-700 text-white text-sm py-2 text-center">
        <p>🎉 Free shipping on orders over Rs 5000 | Use code: CRYSTAL20 for 20% off 🎉</p>
      </div>

      <header className="bg-white w-full shadow-sm border-b border-gray-100">
        <div className="max-w-full mx-auto px-6">
        
          <div className="flex items-center justify-between h-20">
           
            <Link to="/" className="flex items-center space-x-3 flex-shrink-0">
              <div className="relative w-18 h-12 flex items-center justify-center">
                <img 
                  src="/cbclgo.png"
                  className="object-contain w-full h-full"
                  alt="Crystal Beauty Clear Logo"
                />
              </div>
              
            </Link>

            <div className="hidden lg:flex items-center space-x-8">
             
              <nav className="flex items-center space-x-8 mr-8">
                <Link
                  to="/"
                  className="text-gray-700 font-medium hover:text-pink-600 transition-colors duration-300 relative group py-2"
                >
                  Home
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-pink-600 transition-all duration-300 group-hover:w-full"></span>
                </Link>
               
                <Link
                  to="/products"
                  className="text-gray-700 font-medium hover:text-pink-600 transition-colors duration-300 relative group py-2"
                >
                  Products
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-pink-600 transition-all duration-300 group-hover:w-full"></span>
                </Link>
                
                <Link
                  to="/about"
                  className="text-gray-700 font-medium hover:text-pink-600 transition-colors duration-300 relative group py-2"
                >
                  About Us
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-pink-600 transition-all duration-300 group-hover:w-full"></span>
                </Link>
            
                <Link
                  to="/contact"
                  className="text-gray-700 font-medium hover:text-pink-600 transition-colors duration-300 relative group py-2"
                >
                  Contact
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-pink-600 transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </nav>

              <div className="flex items-center space-x-6 border-l border-gray-200 pl-8">
                <Link
                  to="/wishlist"
                  className="p-2 text-gray-600 hover:text-pink-600 transition-colors duration-300 relative group"
                >
                  <FiHeart className="text-xl" />
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-pink-500 text-white text-xs rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>
                </Link>

                <Link
                  to="/cart"
                  className="p-2 text-gray-600 hover:text-pink-600 transition-colors duration-300 relative group"
                >
                  <FiShoppingCart className="text-xl" />
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-pink-500 text-white text-xs rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                  
                </Link>

                <Link
                  to="/login"
                  className="flex items-center space-x-2 bg-gradient-to-r from-pink-500 to-pink-600 text-white px-4 py-2 rounded-full hover:from-pink-600 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl group"
                >
                  <FiUser className="text-sm" />
                  <span className="text-sm font-medium">Login</span>
                  <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-xs bg-gray-800 text-white px-2 py-1 rounded whitespace-nowrap">
                    Account
                  </span>
                </Link>
              </div>
            </div>

            <RxHamburgerMenu 
              onClick={() => setIsSliderOpen(true)}
              className="text-2xl cursor-pointer text-gray-700 lg:hidden" 
            />
          </div>
        </div>
      </header>
    </>
  );
}