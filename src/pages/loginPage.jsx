import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function LoginPage() {
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
  
  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")

  function login() {
    const loginData = {
      email: email.trim(),
      password: password.trim()
    };

    axios.post(import.meta.env.VITE_BACKEND_URL + "/api/users/login", 
      loginData,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    ).then((res) => {
      if (!res.data.user) {
        toast.error(res.data.message);
        return;
      }
      toast.success("Login success");
      localStorage.setItem("token", res.data.token);
      if (res.data.user.type === "admin") {
        window.location.href = "/admin"; 
      } else {
        window.location.href = "/";
      }
    }).catch((error) => {
      toast.error("Login failed. Please check your credentials.");
    });
  }

  return (
    <div className="flex min-h-screen w-full bg-white fixed overflow-hidden">

      <motion.div 
        className="hidden lg:flex w-2/3 relative overflow-hidden"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10"></div>
        <img 
          src="/dd.png" 
          alt="Crystal Beauty Clear Skincare"
          className="w-full h-full object-cover"
        />
       
        <div className="absolute bottom-8 left-8 right-8 z-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-white"
          >
            <h2 className="text-3xl font-bold mb-2 drop-shadow-lg">Discover Your Radiance</h2>
            <p className="text-lg opacity-90 drop-shadow-md">Experience the power of crystal-infused skincare</p>
            
          </motion.div>
        </div>
      </motion.div>

      <div className="w-full lg:w-1/3 flex items-center justify-center p-6">
        <motion.div 
          className="w-full max-w-md bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
        >
          <div className="relative p-8">
      
            <motion.div 
              className="text-center mb-6"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <motion.div
                className="flex justify-center mb-4"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex flex-col items-center">
                  <div className="relative w-32 h-20 flex items-center justify-center">
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
                className="text-2xl font-bold text-gray-800"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
              >
                Welcome  to <span className="text-pink-600">Crystal Beauty Clear</span>
              </motion.h1>
              <motion.p 
                className="text-gray-500 text-md mt-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Sign in to your account
              </motion.p>
            </motion.div>

            <motion.div
              className="space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, staggerChildren: 0.1 }}
            >
             
              <motion.div
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 100 }}
              >
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <motion.div whileHover={{ scale: 1.005 }} whileTap={{ scale: 0.995 }}>
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
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full pl-10 pr-4 py-3 text-sm bg-white text-gray-800 border border-gray-200 rounded-xl transition-all duration-200 placeholder-gray-400 hover:border-pink-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200"
                      placeholder="example@gmail.com"
                    />
                  </div>
                </motion.div>
              </motion.div>
              
              <motion.div
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 100, delay: 0.1 }}
              >
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <motion.div whileHover={{ scale: 1.005 }} whileTap={{ scale: 0.995 }}>
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
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full pl-10 pr-4 py-3 text-sm bg-white text-gray-800 border border-gray-200 rounded-xl transition-all duration-200 placeholder-gray-400 hover:border-pink-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200"
                      placeholder="••••••••"
                    />
                  </div>
                </motion.div>
              </motion.div>

              <motion.div 
                className="flex items-center justify-between"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center">
                  <motion.div whileTap={{ scale: 0.95 }} className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-pink-600 focus:ring-pink-500 rounded border-gray-300"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-600 select-none">
                      Remember me
                    </label>
                  </motion.div>
                </div>
                <motion.div whileHover={{ scale: 1.03 }}>
                  <Link to="/forgot-password" className="text-sm font-medium text-pink-600 hover:text-pink-500 transition-colors">
                    Forgot password?
                  </Link>
                </motion.div>
              </motion.div>

              <motion.button
                onClick={login}
                className="w-full py-3 bg-gradient-to-r from-pink-600 to-pink-500 text-white text-sm font-semibold rounded-xl hover:from-pink-700 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-all duration-300 shadow-md relative overflow-hidden group mt-1"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                whileHover={{ 
                  scale: 1.01,
                  boxShadow: "0 8px 20px rgba(219, 39, 119, 0.3)"
                }}
                whileTap={{ scale: 0.99 }}
              >
                <span className="relative z-10">Sign In</span>
                <span className="absolute inset-0 bg-gradient-to-r from-pink-700 to-pink-600 opacity-0 group-hover:opacity-100 transition duration-300"></span>
              </motion.button>

              <motion.div 
                className="relative my-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-3 bg-white text-gray-500">Or continue with</span>
                </div>
              </motion.div>

              <motion.button
                onClick={() => {googleLogin()}}
                className="w-full flex justify-center items-center py-3 px-4 border border-gray-200 text-sm rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-all duration-150 relative overflow-hidden group"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                whileHover={{ 
                  scale: 1.01,
                  backgroundColor: "rgba(249, 250, 251, 0.8)",
                  borderColor: "rgba(219, 39, 119, 0.2)"
                }}
              >
                <span className="absolute inset-0 bg-gray-50 opacity-0 group-hover:opacity-100 transition duration-300"></span>
                <svg className="w-5 h-5 mr-3 relative z-10" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                <span className="relative z-10 text-gray-700 font-medium">Sign in with Google</span>
              </motion.button>

              <motion.div 
                className="text-center text-md pt-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <span className="text-gray-600">Don't have an account? </span>
                <motion.span whileHover={{ scale: 1.05 }}>
                  <Link to="/signup" className="font-medium text-pink-600 hover:text-pink-500 transition-colors">
                    Sign up
                  </Link>
                </motion.span>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}