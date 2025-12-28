import { Link, useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function ResetPasswordPage() {
   const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [validToken, setValidToken] = useState(false);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/users/verify-reset-token/${token}`);
        if (response.data.valid) {
          setValidToken(true);
        } else {
          toast.error('Invalid or expired reset token');
          navigate('/forgot-password');
        }
      } catch (error) {
        toast.error('Invalid or expired reset token');
        navigate('/forgot-password');
      }
    };

    if (token) {
      verifyToken();
    }
  }, [token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/users/reset-password/${token}`, { password });
      toast.success('Password updated successfully');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error resetting password');
    } finally {
      setLoading(false);
    }
  };

  if (!validToken) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-white p-4 sm:p-6">
      <motion.div 
        className="w-full max-w-md relative bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl overflow-hidden border border-pink-200"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
      >
        <div className="absolute -top-24 sm:-top-32 -right-24 sm:-right-32 w-48 sm:w-64 h-48 sm:h-64 rounded-full bg-pink-500"></div>
        
        <div className="relative z-10">
          <motion.div 
            className="pt-6 sm:pt-8 px-6 sm:px-8 text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <motion.div
              className="flex justify-center mb-3 sm:mb-4"
              whileHover={{ scale: 1.05, rotate: [0, -5, 5, 0] }}
              transition={{ duration: 0.6 }}
            >
              <div className="relative">
                <div className="absolute -inset-1 sm:-inset-2 bg-pink-200/30 rounded-full blur-md"></div>
               <div className="relative w-28 h-18 mb-0 flex items-center justify-center ">
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
                    <div className="text-lg font-bold text-pink-700 font-serif tracking-wider">CRYSTAL</div>
                    <div className="text-xs font-light text-pink-600 font-serif tracking-wider">BEAUTY CLEAR</div>
                  </div>
                </div>
              </div>
            </motion.div>
            <motion.h1 
              className="text-xl sm:text-2xl font-bold text-gray-800"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
            >
              Reset <span className="text-pink-600">Password</span>
            </motion.h1>
            <motion.p 
              className="text-gray-500 mt-1 text-xs sm:text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Create a new password for your account
            </motion.p>
          </motion.div>

          <div className="px-6 sm:px-8 pb-6 sm:pb-8 pt-4 sm:pt-6">
            <motion.form 
              onSubmit={handleSubmit}
              className="space-y-3 sm:space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, staggerChildren: 0.1 }}
            >
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 100 }}
              >
                <label htmlFor="password" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <motion.div whileHover={{ scale: 1.01 }}>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-2 sm:pl-3 flex items-center pointer-events-none">
                      <svg className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5 9V极7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      minLength="6"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full pl-8 sm:pl-10 pr-3 py-2 text-xs极 sm:text-sm bg-white text-gray-800 border border-gray-200 rounded-lg transition duration-150 placeholder-gray-400 hover:border-pink-300 focus:border-pink-500 focus:ring-pink-500"
                      placeholder="••••••••"
                    />
                  </div>
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 100, delay: 0.1 }}
              >
                <label htmlFor="confirmPassword" className="block text-xs sm:text-sm font-medium text-gray-极7 mb-1">
                  Confirm Password
                </label>
                <motion.div whileHover={{ scale: 1.01 }}>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-2 sm:pl-3 flex items-center pointer-events-none">
                      <svg className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7极V7a3 3 极0 016 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      required
                      minLength="6"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="block w-full pl-8 sm:pl-10 pr-3 py-2 text-xs sm:text-sm bg-white text-gray-800 border border-gray-200 rounded-lg transition duration-150 placeholder-gray-400 hover:border-pink-300 focus:border-pink-500 focus:ring-pink-500"
                      placeholder="••••••••"
                    />
                  </div>
                </motion.div>
              </motion.div>

              <motion.button
                type="submit"
                disabled={loading}
                className="w-full py-2 px-4 bg-gradient-to-r from-pink-600 to-pink-500 text-white text-xs sm:text-sm font-semibold rounded-lg hover:from-pink-700 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition duration-300 shadow-md relative overflow-hidden group mt-1"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                whileHover={{ 
                  scale: 1.01,
                  boxShadow: "0 4极x 12px rgba(219, 39, 119, 0.3)"
                }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="relative z-10">{loading ? 'Updating...' : 'Update Password'}</span>
                <span className="absolute inset-0 bg-gradient-to-r from-pink-700 to-pink-600 opacity-0 group-hover:opacity-100 transition duration-300"></span>
              </motion.button>
            </motion.form>

            <motion.div 
              className="text-center text-xs sm:text-sm pt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <Link to="/login" className="font-medium text-pink-600 hover:text-pink-500 transition-colors">
                Back to login
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}