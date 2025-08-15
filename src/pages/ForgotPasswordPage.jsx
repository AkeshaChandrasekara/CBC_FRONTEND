import { Link } from 'react-router-dom';
import { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/users/forgot-password`, { email });
      toast.success('Password reset link sent to your email');
      setEmailSent(true);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error sending reset link');
    } finally {
      setLoading(false);
    }
  };

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
                Forgot Password
              </motion.h3>
              <motion.p 
                className="text-gray-500 text-sm"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.5 }}
              >
                {emailSent ? 'Check your email for reset instructions' : 'Enter your email to receive a reset link'}
              </motion.p>
              <motion.div 
                className="w-16 h-0.5 bg-yellow-600 mx-auto mt-4 rounded-full"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
              />
            </div>

            {!emailSent ? (
              <form onSubmit={handleSubmit} className="space-y-4">
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

                <motion.button
                  type="submit"
                  disabled={loading}
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
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </motion.button>
              </form>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-center"
              >
                <svg className="mx-auto h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <p className="mt-3 text-gray-600">We've sent a password reset link to your email address.</p>
                <p className="mt-1 text-sm text-gray-500">Didn't receive it? Check your spam folder or <button onClick={() => setEmailSent(false)} className="text-yellow-600 hover:text-yellow-500">try again</button>.</p>
              </motion.div>
            )}

            <motion.div 
              className="text-center text-sm pt-5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4, duration: 0.5 }}
            >
              <Link to="/login" className="font-medium text-yellow-600 hover:text-yellow-500">
                Back to login
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}