import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const googleLogin = useGoogleLogin({
    onSuccess: (res) => {
      console.log(res)
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
      console.error("Login error:", error);
    });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <div className="w-full max-w-6xl flex flex-col md:flex-row rounded-2xl overflow-hidden shadow-2xl">
  
        <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-slate-800 to-slate-900 p-10 relative">
          <motion.div 
            className="w-full h-full flex flex-col items-center justify-center z-20 absolute top-0 left-0" 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.img 
              src='/logo.png'
              className="w-36 h-36 object-contain" 
              alt="Crystal Beauty Clear Logo"
            />
            <motion.div className="flex flex-col items-center mt-1"> 
              <motion.h1 
                className="text-5xl font-bold text-white font-serif tracking-wider" 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                CRYSTAL
              </motion.h1>
              <motion.h2 
                className="text-xl font-light text-white font-serif tracking-wider"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                BEAUTY CLEAR
              </motion.h2>
            </motion.div>
            <motion.div 
              className="w-24 h-1 bg-yellow-600 rounded-full my-4" 
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.7, duration: 0.8 }}
            />
            <motion.p 
              className="text-gray-400 text-l italic tracking-wider text-center max-w-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.8 }}
            >
              "Luxury Beauty Redefined"
            </motion.p>
          </motion.div>
        </div>

        <div className="w-full md:w-1/2 bg-white p-8 md:p-12 flex flex-col justify-center">
          <motion.div 
            className="w-full max-w-md mx-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <div className="text-center mb-10">
              <motion.h3 
                className="text-3xl font-bold text-gray-800 mb-2 font-serif"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                Welcome to <span className="whitespace-nowrap">Crystal Beauty Clear</span>
              </motion.h3>
              <motion.p 
                className="text-gray-500 text-sm"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.5 }}
              >
                Sign in to access your account
              </motion.p>
              <motion.div 
                className="w-16 h-0.5 bg-yellow-600 mx-auto mt-4 rounded-full"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
              />
            </div>

            <div className="space-y-4">
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
              >
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1 pt-0">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 text-sm border border-gray-200 rounded-lg focus:border-transparent transition duration-150 bg-gray-50"
                  placeholder="email@example.com"
                />
              </motion.div>
              
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.9, duration: 0.5 }}
              >
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 text-sm border border-gray-200 rounded-lg focus:border-transparent transition duration-150 bg-gray-50"
                  placeholder="••••••••"
                />
              </motion.div>

              <motion.div 
                className="flex items-center justify-between"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.5 }}
              >
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-yellow-500 focus:ring-yellow-400 rounded border-gray-300"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-600">
                    Remember me
                  </label>
                </div>
                <div className="text-sm">
                  <Link to="/forgot-password" className="font-medium text-yellow-600 hover:text-yellow-500 transition-colors">
                    Forgot password?
                  </Link>
                </div>
              </motion.div>

              <motion.button
                onClick={login}
                className="w-full py-2 px-4 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition duration-300 flex items-center justify-center font-medium"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.1, duration: 0.5 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  background:  '#D4AF37',
                  color: 'white',
                  boxShadow: '0 4px 14px 0 rgba(212, 175, 55, 0.3)'
                }}
              >
                Sign In
              </motion.button>

              <motion.div 
                className="relative my-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.5 }}
              >
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-2 bg-white text-gray-400">Or continue with</span>
                </div>
              </motion.div>

              <motion.button
                onClick={() => {googleLogin()}}
                className="w-full flex justify-center text-gray-700 items-center gap-2 py-2 px-4 border border-gray-200 text-sm rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-yellow-400 transition duration-150 font-medium"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.3, duration: 0.5 }}
                whileHover={{ scale: 1.02 }}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Sign in with Google
              </motion.button>

              <motion.div 
                className="text-center text-sm pt-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.4, duration: 0.5 }}
              >
                <span className="text-gray-500">Don't have an account? </span>
                <Link to="/signup" className="font-medium text-yellow-600 hover:text-yellow-500 transition-colors">
                  Sign up
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}