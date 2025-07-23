import { useState } from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import { Link } from "react-router-dom";
import NavSlider from "./navSlider";

export default function Header() {
  const [isSliderOpen, setIsSliderOpen] = useState(false);
  return (
    <>
      {isSliderOpen && <NavSlider closeSlider={() => setIsSliderOpen(false)} />}
      <header className="bg-slate-900 w-full h-20 relative flex justify-between items-center px-6 shadow-lg">
        <div className="flex items-center">
          <img
            src="/logo.png"
            className="cursor-pointer h-16 rounded-full"
            alt="Logo"
          />
        </div>

        <RxHamburgerMenu 
          onClick={() => setIsSliderOpen(true)}
          className="text-3xl cursor-pointer text-white lg:hidden" 
        />

        <nav className="hidden lg:flex items-center space-x-8">
          <Link
            to="/"
            className="text-white font-medium text-lg hover:text-yellow-400 transition-colors duration-300"
          >
            Home
          </Link>
         
               <Link
            to="/products"
            className="text-white font-medium text-lg hover:text-yellow-400 transition-colors duration-300"
          >
            Products
          </Link>
           <Link
            to="/about"
            className="text-white font-medium text-lg hover:text-yellow-400 transition-colors duration-300"
          >
            About Us
          </Link>
     
          
          <Link
            to="/contact"
            className="text-white font-medium text-lg hover:text-yellow-400 transition-colors duration-300"
          >
            Contact Us
          </Link>
          <Link
            to="/cart"
            className="text-white font-medium text-lg hover:text-yellow-400 transition-colors duration-300"
          >
            Cart
          </Link>
          <Link
            to="/login"
            className="ml-4 px-4 py-2 bg-yellow-500 text-black font-medium rounded-md hover:bg-yellow-400 transition-colors duration-300"
          >
            Login
          </Link>
        </nav>
      </header>
    </>
  );
}