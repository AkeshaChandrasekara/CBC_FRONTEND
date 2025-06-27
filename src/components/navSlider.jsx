import { IoMdClose } from "react-icons/io";
import { Link } from "react-router-dom";

export default function NavSlider({ closeSlider }) {
  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-80 z-50 lg:hidden">
      <div className="absolute right-0 w-80 h-full bg-gray-800 shadow-xl">
        <div className="flex justify-between items-center p-4 border-b border-gray-800">
          <img
            src="/logo.png"
            className="h-14 rounded-full"
            alt="Logo"
          />
          <IoMdClose
            onClick={closeSlider}
            className="text-3xl cursor-pointer text-white"
          />
        </div>
        
        <div className="flex flex-col p-4 space-y-6">
          <Link
            to="/"
            onClick={closeSlider}
            className="text-white font-medium text-lg hover:text-yellow-400 transition-colors duration-300"
          >
            Home
          </Link>
          <Link
            to="/products"
            onClick={closeSlider}
            className="text-white font-medium text-lg hover:text-yellow-400 transition-colors duration-300"
          >
            Products
          </Link>
          <Link
            to="/about"
            onClick={closeSlider}
            className="text-white font-medium text-lg hover:text-yellow-400 transition-colors duration-300"
          >
            About Us
          </Link>
          <Link
            to="/contact"
            onClick={closeSlider}
            className="text-white font-medium text-lg hover:text-yellow-400 transition-colors duration-300"
          >
            Contact Us
          </Link>
          <Link
            to="/cart"
            onClick={closeSlider}
            className="text-white font-medium text-lg hover:text-yellow-400 transition-colors duration-300"
          >
            Cart
          </Link>
          <Link
            to="/login"
            onClick={closeSlider}
            className="mt-8 px-4 py-2 bg-yellow-500 text-black font-medium rounded-md text-center hover:bg-yellow-400 transition-colors duration-300"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}