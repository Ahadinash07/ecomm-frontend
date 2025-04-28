import React, { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { FaLock } from 'react-icons/fa';

const PasswordForm = () => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (formData.newPassword !== formData.confirmPassword) {
      setError('New password and confirmation do not match');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        'https://ecomm-backend-blue.vercel.app/api/auth/password',
        {
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSuccess(response.data.message);
      setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  const inputVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <motion.form
      key="password-form"
      onSubmit={handleSubmit}
      className="space-y-3 w-full max-w-sm mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div key="current-password" variants={inputVariants}>
        <label className="block text-gray-700 text-sm font-medium mb-1">Current Password</label>
        <div className="relative">
          <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="password"
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleChange}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            placeholder="Enter current password"
            required
            aria-label="Current Password"
          />
        </div>
      </motion.div>
      <motion.div key="new-password" variants={inputVariants}>
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
      <motion.div key="confirm-password" variants={inputVariants}>
        <label className="block text-gray-700 text-sm font-medium mb-1">Confirm New Password</label>
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
          key="error"
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
          key="success"
          className="text-green-500 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          {success}
        </motion.p>
      )}
      <motion.button
        key="submit-button"
        type="submit"
        className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity text-sm font-medium"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        disabled={loading}
        aria-label="Update Password"
      >
        {loading ? 'Updating...' : 'Update Password'}
      </motion.button>
    </motion.form>
  );
};

export default PasswordForm;

// const PasswordForm = () => {
//   const [formData, setFormData] = useState({
//     currentPassword: '',
//     newPassword: '',
//     confirmPassword: '',
//   });
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setSuccess('');
//     setLoading(true);

//     if (formData.newPassword !== formData.confirmPassword) {
//       setError('New password and confirmation do not match');
//       setLoading(false);
//       return;
//     }

//     try {
//       const token = localStorage.getItem('token');
//       const response = await axios.put(
//         'https://ecomm-backend-blue.vercel.app/api/auth/password',
//         {
//           currentPassword: formData.currentPassword,
//           newPassword: formData.newPassword,
//         },
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       setSuccess(response.data.message);
//       setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
//     } catch (err) {
//       setError(err.response?.data?.message || 'Failed to update password');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <motion.form
//       onSubmit={handleSubmit}
//       className="space-y-4"
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       transition={{ delay: 0.2 }}
//     >
//       <div>
//         <label className="block text-gray-700">Current Password</label>
//         <input
//           type="password"
//           name="currentPassword"
//           value={formData.currentPassword}
//           onChange={handleChange}
//           className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//           required
//         />
//       </div>
//       <div>
//         <label className="block text-gray-700">New Password</label>
//         <input
//           type="password"
//           name="newPassword"
//           value={formData.newPassword}
//           onChange={handleChange}
//           className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//           required
//         />
//       </div>
//       <div>
//         <label className="block text-gray-700">Confirm New Password</label>
//         <input
//           type="password"
//           name="confirmPassword"
//           value={formData.confirmPassword}
//           onChange={handleChange}
//           className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//           required
//         />
//       </div>
//       {error && <p className="text-red-500">{error}</p>}
//       {success && <p className="text-green-500">{success}</p>}
//       <motion.button
//         type="submit"
//         className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-lg hover:opacity-90 transition-opacity"
//         whileHover={{ scale: 1.05 }}
//         whileTap={{ scale: 0.95 }}
//         disabled={loading}
//       >
//         {loading ? 'Updating...' : 'Update Password'}
//       </motion.button>
//     </motion.form>
//   );
// };

// export default PasswordForm;