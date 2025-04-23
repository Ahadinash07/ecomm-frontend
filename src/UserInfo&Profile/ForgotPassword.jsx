import React, { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import { FaEnvelope, FaPhone, FaLock } from 'react-icons/fa';

const ForgotPassword = () => {
  const { sendForgotPasswordOtp, resetPassword } = useContext(AuthContext);
  const [step, setStep] = useState(1); // 1: Enter email/phone, 2: Enter OTP and new password
  const [formData, setFormData] = useState({
    emailOrPhone: '',
    otp: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    const result = await sendForgotPasswordOtp(formData.emailOrPhone);
    setLoading(false);

    if (result.success) {
      setSuccess(result.message);
      setStep(2);
    } else {
      setError(result.message);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (formData.newPassword !== formData.confirmPassword) {
      setError('New password and confirmation do not match');
      setLoading(false);
      return;
    }

    const result = await resetPassword(formData.emailOrPhone, formData.otp, formData.newPassword);
    setLoading(false);

    if (result.success) {
      setSuccess(result.message);
      setFormData({ emailOrPhone: '', otp: '', newPassword: '', confirmPassword: '' });
      setStep(1);
    } else {
      setError(result.message);
    }
  };

  const inputVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <motion.div
      key="forgot-password"
      className="space-y-3 w-full max-w-sm mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {step === 1 ? (
        <motion.form key="otp-form" onSubmit={handleSendOtp}>
          <motion.div variants={inputVariants}>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Email or Phone
            </label>
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="emailOrPhone"
                value={formData.emailOrPhone}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="Enter email or phone"
                required
                aria-label="Email or Phone"
              />
            </div>
          </motion.div>
          {error && (
            <motion.p
              key="error-otp"
              className="text-red-500 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              {error}
            </motion.p>
          )}
          {success && (
            <motion.p
              key="success-otp"
              className="text-green-500 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              {success}
            </motion.p>
          )}
          <motion.button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity text-sm font-medium mt-3"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            aria-label="Send OTP"
          >
            {loading ? 'Sending...' : 'Send OTP'}
          </motion.button>
        </motion.form>
      ) : (
        <motion.form key="reset-form" onSubmit={handleResetPassword}>
          <motion.div key="otp-input" variants={inputVariants}>
            <label className="block text-gray-700 text-sm font-medium mb-1">OTP</label>
            <div className="relative">
              <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="otp"
                value={formData.otp}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="Enter OTP"
                required
                aria-label="OTP"
              />
            </div>
          </motion.div>
          <motion.div key="new-password-input" variants={inputVariants}>
            <label className="block text-gray-700 text-sm font-medium mb-1">New Password</label>
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="Enter new password"
                required
                aria-label="New Password"
              />
            </div>
          </motion.div>
          <motion.div key="confirm-password-input" variants={inputVariants}>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Confirm New Password
            </label>
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="Confirm new password"
                required
                aria-label="Confirm New Password"
              />
            </div>
          </motion.div>
          {error && (
            <motion.p
              key="error-reset"
              className="text-red-500 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              {error}
            </motion.p>
          )}
          {success && (
            <motion.p
              key="success-reset"
              className="text-green-500 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              {success}
            </motion.p>
          )}
          <motion.button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity text-sm font-medium mt-3"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            aria-label="Reset Password"
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </motion.button>
          <motion.button
            onClick={() => setStep(1)}
            className="w-full text-blue-600 hover:underline text-sm font-medium mt-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            aria-label="Back to Send OTP"
          >
            Back to Send OTP
          </motion.button>
        </motion.form>
      )}
    </motion.div>
  );
};

export default ForgotPassword;