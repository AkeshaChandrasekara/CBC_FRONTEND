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
              Reset Your Password
            </motion.h3>
            <motion.p 
              className="text-gray-500 text-sm mb-4"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              {emailSent ? 'Check your email for reset instructions' : 'Enter your email to receive a reset link'}
            </motion.p>
            <motion.div 
              className="w-16 h-0.5 bg-yellow-500 mx-auto"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            />
          </div>

          {!emailSent ? (
            <form onSubmit={handleSubmit} className="space-y-5">
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
                  placeholder="your@email.com"
                />
              </motion.div>

              <motion.button
                type="submit"
                disabled={loading}
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
  );
}