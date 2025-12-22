import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

export const LoginScreen: React.FC = () => {
  const { login, register, continueAsGuest, isLoading } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(email, password, name);
      }
    } catch (err) {
      setError('Authentication failed. Try again.');
    }
  };

  return (
    <div className="fixed inset-0 bg-[#F5F5F7] flex items-center justify-center z-50">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md p-8 bg-white rounded-3xl shadow-soft"
      >
        <div className="text-center mb-8">
          <motion.h1 
            className="text-4xl font-black mb-2 tracking-tight text-gray-900"
            layoutId="title"
          >
            g-rump
          </motion.h1>
          <p className="text-gray-500 font-medium">
            {isLogin ? 'Welcome back, human.' : 'Oh great, another one.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <AnimatePresence mode="wait">
            {!isLogin && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <input
                  type="text"
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-4 bg-gray-50 rounded-2xl outline-none text-gray-900 placeholder-gray-400 focus:shadow-float transition-all duration-300"
                  required={!isLogin}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-4 bg-gray-50 rounded-2xl outline-none text-gray-900 placeholder-gray-400 focus:shadow-float transition-all duration-300"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-4 bg-gray-50 rounded-2xl outline-none text-gray-900 placeholder-gray-400 focus:shadow-float transition-all duration-300"
            required
          />

          {error && (
            <p className="text-red-500 text-sm text-center font-medium">{error}</p>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-4 bg-black text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : (isLogin ? 'Sign In' : 'Join the Misery')}
          </motion.button>
        </form>

        <div className="mt-6 space-y-4 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-gray-500 font-medium hover:text-gray-900 transition-colors"
          >
            {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
          </button>
          
          <div className="border-t border-gray-100 pt-4">
            <button
              onClick={continueAsGuest}
              className="text-sm text-gray-400 font-medium hover:text-gray-600 transition-colors"
            >
              Continue as Guest (Limited Access)
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
