import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";
import { IoMdMail } from "react-icons/io";
import { FiPhone } from "react-icons/fi";
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-white text-pink-600 pt-12 pb-8 border-t border-gray-100">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
    
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-3">
              <div className="relative w-18 h-12 flex items-center justify-center">
                <img 
                  src="/cbclgo.png"
                  className="object-contain w-full h-full"
                  alt="Crystal Beauty Clear Logo"
                />
              </div>
              <span className="text-pink-600 font-bold text-xl">Crystal Beauty Clear</span>
            </Link>
            <p className="text-gray-600">
              Premium crystal-infused skincare for radiant, glowing skin.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-pink-500 hover:text-pink-700 transition-colors duration-300">
                <FaFacebook size={20} />
              </a>
              <a href="#" className="text-pink-500 hover:text-pink-700 transition-colors duration-300">
                <FaTwitter size={20} />
              </a>
              <a href="#" className="text-pink-500 hover:text-pink-700 transition-colors duration-300">
                <FaInstagram size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-pink-600">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 hover:text-pink-600 transition-colors duration-300">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-600 hover:text-pink-600 transition-colors duration-300">
                  Products
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-600 hover:text-pink-600 transition-colors duration-300">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 hover:text-pink-600 transition-colors duration-300">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-pink-600">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <IoMdMail className="text-pink-500 mt-1" />
                <span className="text-gray-600">info@crystalbeauty.com</span>
              </div>
              <div className="flex items-start space-x-3">
                <FiPhone className="text-pink-500 mt-1" />
                <span className="text-gray-600">011 222 3333</span>
              </div>
              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-pink-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-gray-600">B11, Deens Road, Maradana, Sri Lanka</span>
              </div>
            </div>
          </div>

          
          <div>
            <h3 className="text-lg font-semibold mb-4 text-pink-600">Newsletter</h3>
            <p className="text-gray-600 mb-4">
              Subscribe for exclusive offers and skincare tips.
            </p>
            <div className="flex">
              <input 
                type="email" 
                placeholder="Your email" 
                className="px-4 py-2 w-full rounded-l-md focus:outline-none focus:ring-2 focus:ring-pink-500 text-gray-800 border border-r-0 border-gray-300"
              />
              <button className="bg-pink-600 hover:bg-pink-700 text-white font-medium px-4 py-2 rounded-r-md transition-colors duration-300">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-6 text-center text-gray-600">
          <p>&copy; {new Date().getFullYear()} Crystal Beauty Clear | All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}