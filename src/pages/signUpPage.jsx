import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function SignupPage() {
  const navigate = useNavigate();
  const googleLogin = useGoogleLogin({
    onSuccess: (res) => {
      axios.post(import.meta.env.VITE_BACKEND_URL+"/api/users/google",{
        token : res.access_token
      }).then(
        (res)=>{
          if(res.data.message == "User created"){
            toast.success("Your account is created now you can login via google.")
          }else{
            localStorage.setItem("token",res.data.token)
            if(res.data.user.type == "admin"){
              window.location.href = "/admin"
            }else{
              window.location.href = "/"
            }
          }
        }
      )
    }
  })
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    mobile: '',
    email: '',
    password: ''
  });

  function signup() {
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!/^\d{10}$/.test(formData.mobile)) {
      toast.error("Please enter a valid 10-digit mobile number");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    axios.post(import.meta.env.VITE_BACKEND_URL + "/api/users", 
      formData,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    ).then((res) => {
      if (res.data.message === "User created") {
        toast.success("Account created successfully! Please login.");
        navigate('/login');
      } else {
        toast.error(res.data.message || "Signup failed");
      }
    }).catch((error) => {
      toast.error(error.response?.data?.message || "Signup failed");
      console.error("Signup error:", error);
    });
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-white p-4 sm:p-6">
      <motion.div 
        className="w-full max-w-md relative bg-white rounded-2xl shadow-xl overflow-hidden border border-pink-200"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
      >
        <div className="absolute -top-24 sm:-top-32 -right-24 sm:-right-32 w-48 sm:w-64 h-48 sm:h-64 rounded-full bg-pink-500"></div>
        
        <div className="relative z-10 p-8">
          <motion.div 
            className="text-center mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <motion.div
              className="flex justify-center mb-4"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex flex-col items-center">
                <div className="relative w-28 h-18 mb-1 flex items-center justify-center">
                  <img 
                    src="/cbclgo.png"
                    className="object-contain w-full h-full"
                    alt="Crystal Beauty Clear Logo"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div className="hidden flex-col items-center justify-center">
                    <div className="text-xl font-bold text-pink-700 font-serif tracking-wider">CRYSTAL</div>
                    <div className="text-sm font-light text-pink-600 font-serif tracking-wider">BEAUTY CLEAR</div>
                  </div>
                </div>
              </div>
            </motion.div>
            <motion.h1 
              className="text-2xl font-bold text-gray-800 mt-0"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
            >
              Join <span className="text-pink-600">Crystal Beauty Clear</span>
            </motion.h1>
            <motion.p 
              className="text-gray-500 mt-2 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Create your account to get started
            </motion.p>
          </motion.div>

          <motion.div
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, staggerChildren: 0.1 }}
          >
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 100 }}
              className="flex space-x-3"
            >
              <div className="flex-1">
                <label htmlFor="firstName" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <motion.div whileHover={{ scale: 1.01 }}>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-2 py-2 text-sm bg-white text-gray-800 border border-gray-200 rounded-lg transition duration-150 placeholder-gray-400 hover:border-pink-300 focus:border-pink-500 focus:ring-pink-500"
                      placeholder="First Name"
                    />
                  </div>
                </motion.div>
              </div>
              <div className="flex-1">
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <motion.div whileHover={{ scale: 1.01 }}>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-2 py-2 text-sm bg-white text-gray-800 border border-gray-200 rounded-lg transition duration-150 placeholder-gray-400 hover:border-pink-300 focus:border-pink-500 focus:ring-pink-500"
                      placeholder="Last Name"
                    />
                  </div>
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 100, delay: 0.1 }}
            >
              <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-1">
                Mobile Number
              </label>
              <motion.div whileHover={{ scale: 1.01 }}>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7 2a2 2 0 00-2 2v12a2 2 0 002 2h6a2 2 0 002-2V4a2 2 0 00-2-2H7zm3 14a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    id="mobile"
                    name="mobile"
                    type="tel"
                    required
                    value={formData.mobile}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-2 text-sm bg-white text-gray-800 border border-gray-200 rounded-lg transition duration-150 placeholder-gray-400 hover:border-pink-300 focus:border-pink-500 focus:ring-pink-500"
                    placeholder="Mobile Number"
                    pattern="[0-9]{10}"
                    maxLength="10"
                  />
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
            >
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <motion.div whileHover={{ scale: 1.01 }}>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-2 py-2 text-sm bg-white text-gray-800 border border-gray-200 rounded-lg transition duration-150 placeholder-gray-400 hover:border-pink-300 focus:border-pink-500 focus:ring-pink-500"
                    placeholder="example@gmail.com"
                  />
                </div>
              </motion.div>
            </motion.div>
            
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 100, delay: 0.3 }}
            >
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <motion.div whileHover={{ scale: 1.01 }}>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-2 py-2 text-sm bg-white text-gray-800 border border-gray-200 rounded-lg transition duration-150 placeholder-gray-400 hover:border-pink-300 focus:border-pink-500 focus:ring-pink-500"
                    placeholder="••••••••"
                    minLength="6"
                  />
                </div>
              </motion.div>
            </motion.div>

            <motion.button
              onClick={signup}
              className="w-full py-2 bg-gradient-to-r from-pink-600 to-pink-500 text-white text-sm font-semibold rounded-lg hover:from-pink-700 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition duration-300 shadow-md relative overflow-hidden group mt-2"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              whileHover={{ 
                scale: 1.01,
                boxShadow: "0 4px 12px rgba(219, 39, 119, 0.3)"
              }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="relative z-10">Sign Up</span>
              <span className="absolute inset-0 bg-gradient-to-r from-pink-700 to-pink-600 opacity-0 group-hover:opacity-100 transition duration-300"></span>
            </motion.button>

            <motion.div 
              className="relative my-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-0 bg-white text-gray-500">Or continue with</span>
              </div>
            </motion.div>

            <motion.button
              onClick={() => {googleLogin()}}
              className="w-full flex justify-center items-center py-2 px-4 border border-gray-200 text-sm rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition duration-150 relative overflow-hidden group"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              whileHover={{ 
                scale: 1.01,
                backgroundColor: "rgba(249, 250, 251, 0.8)"
              }}
            >
              <span className="absolute inset-0 bg-gray-50 opacity-0 group-hover:opacity-100 transition duration-300"></span>
              <svg className="w-5 h-5 mr-2 relative z-10" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span className="relative z-10 text-gray-700">Sign up with Google</span>
            </motion.button>

            <motion.div 
              className="text-center text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <span className="text-gray-600">Already have an account? </span>
              <motion.span whileHover={{ scale: 1.05 }}>
                <Link to="/login" className="font-medium text-pink-600 hover:text-pink-500 transition-colors">
                  Sign in
                </Link>
              </motion.span>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}