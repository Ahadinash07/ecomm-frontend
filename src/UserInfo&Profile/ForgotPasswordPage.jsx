import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ForgotPassword from './ForgotPassword';

const ForgotPasswordPage = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      className="container mx-auto py-6 px-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Forgot Password
        </h1>
        <button
          onClick={() => navigate('/login')}
          className="text-blue-600 hover:underline text-sm font-medium"
        >
          Back to Login
        </button>
      </div>
      <div className="bg-white rounded-xl shadow-md p-6 max-w-sm mx-auto">
        <ForgotPassword />
      </div>
    </motion.div>
  );
};

export default ForgotPasswordPage;