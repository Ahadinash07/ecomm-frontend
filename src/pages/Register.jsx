import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import { Loader, Eye, EyeOff } from 'lucide-react';
import AnimatedBackground from '../Background/BackgroundofLogin&Register/AnimatedBackground';

const Register = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    phone: '',
    password: '',
    confirm_password: '',
  });
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register, verifyOtp } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.password !== formData.confirm_password) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    const { confirm_password, ...registerData } = formData;
    const result = await register(registerData);
    setIsLoading(false);
    if (result.success) {
      setOtpSent(true);
      setSuccess(result.message);
    } else {
      setError(result.message);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);
    try {
      const result = await verifyOtp(formData.email, otp);
      setIsLoading(false);
      if (result.success) {
        setSuccess(result.message);
        navigate('/');
      } else {
        console.error('OTP verification failed:', result);
        setError(result.message);
      }
    } catch (error) {
      setIsLoading(false);
      console.error('Unexpected error during OTP verification:', error);
      setError('An unexpected error occurred. Please try again.');
    }
  };

  const handleResendOtp = async () => {
    setError('');
    setSuccess('');
    setIsLoading(true);
    const { confirm_password, ...registerData } = formData;
    const result = await register(registerData);
    setIsLoading(false);
    if (result.success) {
      setSuccess('OTP resent successfully');
    } else {
      setError(result.message);
    }
  };

  const containerVariants = {
    initial: { opacity: 0, y: 50 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
    exit: { opacity: 0, y: -50, transition: { duration: 0.3 } },
  };

  const inputVariants = {
    initial: { x: -20, opacity: 0 },
    animate: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.4, ease: 'easeOut', staggerChildren: 0.1 },
    },
  };

  const messageVariants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3, type: 'spring', stiffness: 200 },
    },
    exit: { opacity: 0, scale: 0.8 },
  };

  return (
    <div className="min-h-screen flex items-center justify-center overflow-hidden relative">
      <AnimatedBackground />
      <motion.div
        className="max-w-md w-full space-y-8 bg-white/90 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-white/30 z-10"
        variants={containerVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        whileHover={{ scale: 1.02 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        <div>
          <h2 className="text-center text-4xl font-bold text-gray-900 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Join E-Shop
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">Create your account</p>
        </div>
        {!otpSent ? (
          <form className="mt-8 space-y-6" onSubmit={handleRegister}>
            <div className="space-y-4">
              <motion.div variants={inputVariants} className="relative">
                <input
                  id="first_name"
                  name="first_name"
                  type="text"
                  required
                  className="peer w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-transparent"
                  placeholder="First Name"
                  value={formData.first_name}
                  onChange={handleInputChange}
                  disabled={isLoading}
                />
                <label
                  htmlFor="first_name"
                  className="absolute left-4 -top-2.5 text-sm text-gray-600 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-indigo-600 bg-white px-1"
                >
                  First Name
                </label>
              </motion.div>
              <motion.div variants={inputVariants} className="relative">
                <input
                  id="last_name"
                  name="last_name"
                  type="text"
                  className="peer w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-transparent"
                  placeholder="Last Name"
                  value={formData.last_name}
                  onChange={handleInputChange}
                  disabled={isLoading}
                />
                <label
                  htmlFor="last_name"
                  className="absolute left-4 -top-2.5 text-sm text-gray-600 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-indigo-600 bg-white px-1"
                >
                  Last Name
                </label>
              </motion.div>
              <motion.div variants={inputVariants} className="relative">
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className="peer w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-transparent"
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleInputChange}
                  disabled={isLoading}
                />
                <label
                  htmlFor="username"
                  className="absolute left-4 -top-2.5 text-sm text-gray-600 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-indigo-600 bg-white px-1"
                >
                  Username
                </label>
              </motion.div>
              <motion.div variants={inputVariants} className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="peer w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-transparent"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={isLoading}
                />
                <label
                  htmlFor="email"
                  className="absolute left-4 -top-2.5 text-sm text-gray-600 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-indigo-600 bg-white px-1"
                >
                  Email
                </label>
              </motion.div>
              <motion.div variants={inputVariants} className="relative">
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  className="peer w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-transparent"
                  placeholder="Phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  disabled={isLoading}
                />
                <label
                  htmlFor="phone"
                  className="absolute left-4 -top-2.5 text-sm text-gray-600 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-indigo-600 bg-white px-1"
                >
                  Phone
                </label>
              </motion.div>
              <motion.div variants={inputVariants} className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="peer w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-transparent"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  disabled={isLoading}
                />
                <label
                  htmlFor="password"
                  className="absolute left-4 -top-2.5 text-sm text-gray-600 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-indigo-600 bg-white px-1"
                >
                  Password
                </label>
                <button
                  type="button"
                  className="absolute right-3 top-3.5 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </motion.div>
              <motion.div variants={inputVariants} className="relative">
                <input
                  id="confirm_password"
                  name="confirm_password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  className="peer w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-transparent"
                  placeholder="Confirm Password"
                  value={formData.confirm_password}
                  onChange={handleInputChange}
                  disabled={isLoading}
                />
                <label
                  htmlFor="confirm_password"
                  className="absolute left-4 -top-2.5 text-sm text-gray-600 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-indigo-600 bg-white px-1"
                >
                  Confirm Password
                </label>
                <button
                  type="button"
                  className="absolute right-3 top-3.5 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isLoading}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </motion.div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.p
                  className="text-red-500 text-sm text-center bg-red-100/80 p-2 rounded-lg"
                  variants={messageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  {error}
                </motion.p>
              )}
              {success && (
                <motion.p
                  className="text-green-500 text-sm text-center bg-green-100/80 p-2 rounded-lg"
                  variants={messageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  {success}
                </motion.p>
              )}
            </AnimatePresence>

            <div>
              <motion.button
                type="submit"
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader className="animate-spin h-5 w-5" />
                ) : (
                  'Register'
                )}
              </motion.button>
            </div>
          </form>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleVerifyOtp}>
            <motion.div variants={inputVariants} className="relative">
              <input
                id="otp"
                name="otp"
                type="text"
                required
                className="peer w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-transparent"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                disabled={isLoading}
              />
              <label
                htmlFor="otp"
                className="absolute left-4 -top-2.5 text-sm text-gray-600 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-indigo-600 bg-white px-1"
              >
                OTP
              </label>
              <button
                type="button"
                className="absolute right-3 top-3 text-sm text-indigo-600 hover:text-indigo-800"
                onClick={handleResendOtp}
                disabled={isLoading}
              >
                Resend OTP
              </button>
            </motion.div>

            <AnimatePresence>
              {error && (
                <motion.p
                  className="text-red-500 text-sm text-center bg-red-100/80 p-2 rounded-lg"
                  variants={messageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  {error}
                </motion.p>
              )}
              {success && (
                <motion.p
                  className="text-green-500 text-sm text-center bg-green-100/80 p-2 rounded-lg"
                  variants={messageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  {success}
                </motion.p>
              )}
            </AnimatePresence>

            <div>
              <motion.button
                type="submit"
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader className="animate-spin h-5 w-5" />
                ) : (
                  'Verify OTP'
                )}
              </motion.button>
            </div>
          </form>
        )}
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;





























// import React, { useState, useContext } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { motion, AnimatePresence } from 'framer-motion';
// import { AuthContext } from '../context/AuthContext';
// import { Loader, Eye, EyeOff } from 'lucide-react';
// import AnimatedBackground from '../Background/BackgroundofLogin&Register/AnimatedBackground';

// const Register = () => {
//   const [formData, setFormData] = useState({
//     first_name: '',
//     last_name: '',
//     username: '',
//     email: '',
//     phone: '',
//     password: '',
//     confirm_password: '',
//   });
//   const [otp, setOtp] = useState('');
//   const [otpSent, setOtpSent] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const { register, verifyOtp } = useContext(AuthContext);
//   const navigate = useNavigate();

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleRegister = async (e) => {
//     e.preventDefault();
//     setError('');
//     setSuccess('');

//     if (formData.password !== formData.confirm_password) {
//       setError('Passwords do not match');
//       return;
//     }

//     setIsLoading(true);
//     const { confirm_password, ...registerData } = formData;
//     const result = await register(registerData);
//     setIsLoading(false);
//     if (result.success) {
//       setOtpSent(true);
//       setSuccess(result.message);
//     } else {
//       setError(result.message);
//     }
//   };

//   const handleVerifyOtp = async (e) => {
//     e.preventDefault();
//     setError('');
//     setSuccess('');
//     setIsLoading(true);
//     const result = await verifyOtp(formData.email, otp);
//     setIsLoading(false);
//     if (result.success) {
//       setSuccess(result.message);
//       navigate('/');
//     } else {
//       setError(result.message);
//     }
//   };

//   const handleResendOtp = async () => {
//     setError('');
//     setSuccess('');
//     setIsLoading(true);
//     const { confirm_password, ...registerData } = formData;
//     const result = await register(registerData);
//     setIsLoading(false);
//     if (result.success) {
//       setSuccess('OTP resent successfully');
//     } else {
//       setError(result.message);
//     }
//   };

//   const containerVariants = {
//     initial: { opacity: 0, y: 50 },
//     animate: {
//       opacity: 1,
//       y: 0,
//       transition: { duration: 0.6, ease: 'easeOut' },
//     },
//     exit: { opacity: 0, y: -50, transition: { duration: 0.3 } },
//   };

//   const inputVariants = {
//     initial: { x: -20, opacity: 0 },
//     animate: {
//       x: 0,
//       opacity: 1,
//       transition: { duration: 0.4, ease: 'easeOut', staggerChildren: 0.1 },
//     },
//   };

//   const messageVariants = {
//     initial: { opacity: 0, scale: 0.8 },
//     animate: {
//       opacity: 1,
//       scale: 1,
//       transition: { duration: 0.3, type: 'spring', stiffness: 200 },
//     },
//     exit: { opacity: 0, scale: 0.8 },
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center overflow-hidden relative">
//       <AnimatedBackground />
//       <motion.div
//         className="max-w-md w-full space-y-8 bg-white/90 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-white/30 z-10"
//         variants={containerVariants}
//         initial="initial"
//         animate="animate"
//         exit="exit"
//         whileHover={{ scale: 1.02 }}
//         transition={{ type: 'spring', stiffness: 300 }}
//       >
//         <div>
//           <h2 className="text-center text-4xl font-bold text-gray-900 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
//             Join E-Shop
//           </h2>
//           <p className="mt-2 text-center text-sm text-gray-600">Create your account</p>
//         </div>
//         {!otpSent ? (
//           <form className="mt-8 space-y-6" onSubmit={handleRegister}>
//             <div className="space-y-4">
//               <motion.div variants={inputVariants} className="relative">
//                 <input
//                   id="first_name"
//                   name="first_name"
//                   type="text"
//                   required
//                   className="peer w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-transparent"
//                   placeholder="First Name"
//                   value={formData.first_name}
//                   onChange={handleInputChange}
//                   disabled={isLoading}
//                 />
//                 <label
//                   htmlFor="first_name"
//                   className="absolute left-4 -top-2.5 text-sm text-gray-600 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-indigo-600 bg-white px-1"
//                 >
//                   First Name
//                 </label>
//               </motion.div>
//               <motion.div variants={inputVariants} className="relative">
//                 <input
//                   id="last_name"
//                   name="last_name"
//                   type="text"
//                   className="peer w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-transparent"
//                   placeholder="Last Name"
//                   value={formData.last_name}
//                   onChange={handleInputChange}
//                   disabled={isLoading}
//                 />
//                 <label
//                   htmlFor="last_name"
//                   className="absolute left-4 -top-2.5 text-sm text-gray-600 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-indigo-600 bg-white px-1"
//                 >
//                   Last Name
//                 </label>
//               </motion.div>
//               <motion.div variants={inputVariants} className="relative">
//                 <input
//                   id="username"
//                   name="username"
//                   type="text"
//                   required
//                   className="peer w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-transparent"
//                   placeholder="Username"
//                   value={formData.username}
//                   onChange={handleInputChange}
//                   disabled={isLoading}
//                 />
//                 <label
//                   htmlFor="username"
//                   className="absolute left-4 -top-2.5 text-sm text-gray-600 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-indigo-600 bg-white px-1"
//                 >
//                   Username
//                 </label>
//               </motion.div>
//               <motion.div variants={inputVariants} className="relative">
//                 <input
//                   id="email"
//                   name="email"
//                   type="email"
//                   required
//                   className="peer w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-transparent"
//                   placeholder="Email"
//                   value={formData.email}
//                   onChange={handleInputChange}
//                   disabled={isLoading}
//                 />
//                 <label
//                   htmlFor="email"
//                   className="absolute left-4 -top-2.5 text-sm text-gray-600 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-indigo-600 bg-white px-1"
//                 >
//                   Email
//                 </label>
//               </motion.div>
//               <motion.div variants={inputVariants} className="relative">
//                 <input
//                   id="phone"
//                   name="phone"
//                   type="tel"
//                   required
//                   className="peer w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-transparent"
//                   placeholder="Phone"
//                   value={formData.phone}
//                   onChange={handleInputChange}
//                   disabled={isLoading}
//                 />
//                 <label
//                   htmlFor="phone"
//                   className="absolute left-4 -top-2.5 text-sm text-gray-600 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-indigo-600 bg-white px-1"
//                 >
//                   Phone
//                 </label>
//               </motion.div>
//               <motion.div variants={inputVariants} className="relative">
//                 <input
//                   id="password"
//                   name="password"
//                   type={showPassword ? 'text' : 'password'}
//                   required
//                   className="peer w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-transparent"
//                   placeholder="Password"
//                   value={formData.password}
//                   onChange={handleInputChange}
//                   disabled={isLoading}
//                 />
//                 <label
//                   htmlFor="password"
//                   className="absolute left-4 -top-2.5 text-sm text-gray-600 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-indigo-600 bg-white px-1"
//                 >
//                   Password
//                 </label>
//                 <button
//                   type="button"
//                   className="absolute right-3 top-3.5 text-gray-500 hover:text-gray-700"
//                   onClick={() => setShowPassword(!showPassword)}
//                   disabled={isLoading}
//                 >
//                   {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//                 </button>
//               </motion.div>
//               <motion.div variants={inputVariants} className="relative">
//                 <input
//                   id="confirm_password"
//                   name="confirm_password"
//                   type={showConfirmPassword ? 'text' : 'password'}
//                   required
//                   className="peer w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-transparent"
//                   placeholder="Confirm Password"
//                   value={formData.confirm_password}
//                   onChange={handleInputChange}
//                   disabled={isLoading}
//                 />
//                 <label
//                   htmlFor="confirm_password"
//                   className="absolute left-4 -top-2.5 text-sm text-gray-600 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-indigo-600 bg-white px-1"
//                 >
//                   Confirm Password
//                 </label>
//                 <button
//                   type="button"
//                   className="absolute right-3 top-3.5 text-gray-500 hover:text-gray-700"
//                   onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                   disabled={isLoading}
//                 >
//                   {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//                 </button>
//               </motion.div>
//             </div>

//             <AnimatePresence>
//               {error && (
//                 <motion.p
//                   className="text-red-500 text-sm text-center bg-red-100/80 p-2 rounded-lg"
//                   variants={messageVariants}
//                   initial="initial"
//                   animate="animate"
//                   exit="exit"
//                 >
//                   {error}
//                 </motion.p>
//               )}
//               {success && (
//                 <motion.p
//                   className="text-green-500 text-sm text-center bg-green-100/80 p-2 rounded-lg"
//                   variants={messageVariants}
//                   initial="initial"
//                   animate="animate"
//                   exit="exit"
//                 >
//                   {success}
//                 </motion.p>
//               )}
//             </AnimatePresence>

//             <div>
//               <motion.button
//                 type="submit"
//                 className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 disabled={isLoading}
//               >
//                 {isLoading ? (
//                   <Loader className="animate-spin h-5 w-5" />
//                 ) : (
//                   'Register'
//                 )}
//               </motion.button>
//             </div>
//           </form>
//         ) : (
//           <form className="mt-8 space-y-6" onSubmit={handleVerifyOtp}>
//             <motion.div variants={inputVariants} className="relative">
//               <input
//                 id="otp"
//                 name="otp"
//                 type="text"
//                 required
//                 className="peer w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-transparent"
//                 placeholder="Enter OTP"
//                 value={otp}
//                 onChange={(e) => setOtp(e.target.value)}
//                 disabled={isLoading}
//               />
//               <label
//                 htmlFor="otp"
//                 className="absolute left-4 -top-2.5 text-sm text-gray-600 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-indigo-600 bg-white px-1"
//               >
//                 OTP
//               </label>
//               <button
//                 type="button"
//                 className="absolute right-3 top-3 text-sm text-indigo-600 hover:text-indigo-800"
//                 onClick={handleResendOtp}
//                 disabled={isLoading}
//               >
//                 Resend OTP
//               </button>
//             </motion.div>

//             <AnimatePresence>
//               {error && (
//                 <motion.p
//                   className="text-red-500 text-sm text-center bg-red-100/80 p-2 rounded-lg"
//                   variants={messageVariants}
//                   initial="initial"
//                   animate="animate"
//                   exit="exit"
//                 >
//                   {error}
//                 </motion.p>
//               )}
//               {success && (
//                 <motion.p
//                   className="text-green-500 text-sm text-center bg-green-100/80 p-2 rounded-lg"
//                   variants={messageVariants}
//                   initial="initial"
//                   animate="animate"
//                   exit="exit"
//                 >
//                   {success}
//                 </motion.p>
//               )}
//             </AnimatePresence>

//             <div>
//               <motion.button
//                 type="submit"
//                 className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 disabled={isLoading}
//               >
//                 {isLoading ? (
//                   <Loader className="animate-spin h-5 w-5" />
//                 ) : (
//                   'Verify OTP'
//                 )}
//               </motion.button>
//             </div>
//           </form>
//         )}
//         <p className="mt-4 text-center text-sm text-gray-600">
//           Already have an account?{' '}
//           <Link
//             to="/login"
//             className="font-medium text-indigo-600 hover:text-indigo-500"
//           >
//             Sign in
//           </Link>
//         </p>
//       </motion.div>
//     </div>
//   );
// };

// export default Register;