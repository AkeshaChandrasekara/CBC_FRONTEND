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
    <div className="flex h-screen w-full bg-gradient-to-br from-gray-50 to-gray-100">
      
      <div className="hidden md:flex md:w-4/5 bg-slate-900 items-start justify-center pt-40 relative overflow-hidden">
  
      

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center w-4/5 z-10"
        >
          <motion.img 
            src='/logo.png'
            className="w-36 h-36 mx-auto mb-4"
            alt="Crystal Beauty Clear Logo"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          />
          <motion.h1 
            className="text-6xl font-bold text-white mb-2 font-serif tracking-wider"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            CRYSTAL
          </motion.h1>
          <motion.h2 
            className="text-2xl font-light text-white mb-6 font-serif tracking-wider"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            BEAUTY CLEAR
          </motion.h2>
          <motion.div 
            className="w-32 h-0.5 bg-yellow-600 mx-auto mb-4"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
          />
          <motion.p 
            className="text-gray-400 text-l italic tracking-wider"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.8 }}
          >
            "Luxury beauty redefined"
          </motion.p>
        </motion.div>
      </div>

      <div className="w-full md:w-4/5 bg-white flex items-center justify-center p-4">
        <motion.div 
          className="w-full max-w-sm bg-white p-8 rounded-lg shadow-lg border border-black"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          style={{
            background: "linear-gradient(145deg, #ffffff, #f8f8f8)",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.05)"
          }}
        >
          <div className="text-center mb-8">
            <motion.h3 
              className="text-3xl font-bold text-gray-950 mb-1 font-serif"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              Welcome to Crystal Beauty Clear
            </motion.h3>
            <motion.p 
              className="text-gray-500 text-sm mb-4"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              Sign in to your account
            </motion.p>
            <motion.div 
              className="w-16 h-0.5 bg-yellow-500 mx-auto"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            />
          </div>

          <div className="space-y-5">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              <label htmlFor="email" className="block text-sm font-medium text-gray-800 mb-1">
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
                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-md focus:ring-1 focus:ring-yellow-500 focus:outline-none transition duration-150 bg-white"
                placeholder="email@example.com"
              />
            </motion.div>
            
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.5 }}
            >
              <label htmlFor="password" className="block text-sm font-medium text-gray-800 mb-1">
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
                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-md focus:ring-1 focus:ring-yellow-500 focus:outline-none transition duration-150 bg-white"
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
                  className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 rounded border-gray-300"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-600">
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <Link to="/forgot-password" className="font-medium text-yellow-600 hover:text-yellow-500">
                  Forgot password?
                </Link>
              </div>
            </motion.div>

            <motion.button
              onClick={login}
              className="w-full py-2.5 px-4 text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition duration-300 flex items-center justify-center"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.1, duration: 0.5 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{ 
                backgroundColor: '#D4AF37',
                color: 'white',
                boxShadow: '0 4px 14px 0 rgba(212, 175, 55, 0.3)'
              }}
            >
              <span className="mr-2 text-m font-medium">Sign In</span>
            
            </motion.button>

            <motion.div 
              className="relative mt-5"
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
              className="w-full flex justify-center items-center py-2.5 px-4 border border-gray-200 text-sm rounded-md hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-yellow-500 transition duration-150"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.3, duration: 0.5 }}
              whileHover={{ scale: 1.02 }}
            >
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Sign in with Google
            </motion.button>

            <motion.div 
              className="text-center text-sm pt-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4, duration: 0.5 }}
            >
              <span className="text-gray-500">Don't have an account? </span>
              <Link to="/signup" className="font-medium text-yellow-600 hover:text-yellow-500">
                Sign up
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}