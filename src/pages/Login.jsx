import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Loader } from 'lucide-react';
import AnimatedBackground from '../Background/BackgroundofLogin&Register/AnimatedBackground';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [useOtp, setUseOtp] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login, sendOtp, loginWithOtp } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!emailOrPhone) {
      setError('Please enter an email or phone number');
      return;
    }
    setIsLoading(true);
    try {
      const result = await sendOtp(emailOrPhone);
      setIsLoading(false);
      if (result.success) {
        setOtpSent(true);
        setSuccess(result.message);
      } else {
        setError(result.message);
      }
    } catch (error) {
      setIsLoading(false);
      setError('Failed to connect to the server. Please try again later.');
      console.error('Send OTP error:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      if (useOtp && otpSent) {
        if (!otp) {
          setError('Please enter the OTP');
          setIsLoading(false);
          return;
        }
        const result = await loginWithOtp(emailOrPhone, otp);
        setIsLoading(false);
        if (result.success) {
          setSuccess(result.message);
          // Check for redirect URL in localStorage
          const redirectTo = localStorage.getItem('redirectAfterLogin') || '/';
          localStorage.removeItem('redirectAfterLogin');
          navigate(redirectTo);
        } else {
          setError(result.message);
        }
      } else {
        if (!password) {
          setError('Please enter a password');
          setIsLoading(false);
          return;
        }
        const result = await login(emailOrPhone, password);
        setIsLoading(false);
        if (result.success) {
          setSuccess(result.message);
          // Check for redirect URL in localStorage
          const redirectTo = localStorage.getItem('redirectAfterLogin') || '/';
          localStorage.removeItem('redirectAfterLogin');
          navigate(redirectTo);
        } else {
          setError(result.message);
        }
      }
    } catch (error) {
      setIsLoading(false);
      setError('Failed to connect to the server. Please try again later.');
      console.error('Submission error:', error);
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
      transition: { duration: 0.4, ease: 'easeOut' },
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
            Welcome to E-Shop
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">Sign in to continue</p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <motion.div variants={inputVariants} className="relative">
              <input
                id="email-or-phone"
                name="emailOrPhone"
                type="text"
                required
                className="peer w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-transparent disabled:bg-gray-200 disabled:cursor-not-allowed"
                placeholder="Email or Phone"
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                disabled={otpSent || isLoading}
              />
              <label
                htmlFor="email-or-phone"
                className="absolute left-4 -top-2.5 text-sm text-gray-600 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-indigo-600 bg-white px-1"
              >
                Email or Phone
              </label>
            </motion.div>
            {!useOtp && (
              <motion.div variants={inputVariants} className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required={!useOtp}
                  className="peer w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-transparent"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
            )}
            {useOtp && otpSent && (
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
                  onClick={handleSendOtp}
                  disabled={isLoading}
                >
                  Resend OTP
                </button>
              </motion.div>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="use-otp"
                name="use-otp"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded cursor-pointer"
                checked={useOtp}
                onChange={(e) => setUseOtp(e.target.checked)}
                disabled={otpSent || isLoading}
              />
              <label htmlFor="use-otp" className="ml-2 block text-sm text-gray-900">
                Login with OTP
              </label>
            </div>
            {!useOtp && (
              <div className="text-sm">
                <Link
                  to="/forgot-password"
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Forgot password?
                </Link>
              </div>
            )}
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
            {useOtp && !otpSent ? (
              <motion.button
                type="button"
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleSendOtp}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader className="animate-spin h-5 w-5" />
                ) : (
                  'Send OTP'
                )}
              </motion.button>
            ) : (
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
                  'Sign in'
                )}
              </motion.button>
            )}
          </div>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link
            to="/register"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Register now
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;



































// import React, { useState, useContext } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { motion, AnimatePresence } from 'framer-motion';
// import { AuthContext } from '../context/AuthContext';
// import { Eye, EyeOff, Loader } from 'lucide-react';
// import AnimatedBackground from '../Background/BackgroundofLogin&Register/AnimatedBackground';

// const Login = () => {
//   const [emailOrPhone, setEmailOrPhone] = useState('');
//   const [password, setPassword] = useState('');
//   const [useOtp, setUseOtp] = useState(false);
//   const [otp, setOtp] = useState('');
//   const [otpSent, setOtpSent] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const { login, sendOtp, loginWithOtp } = useContext(AuthContext);
//   const navigate = useNavigate();

//   const handleSendOtp = async (e) => {
//     e.preventDefault();
//     setError('');
//     setSuccess('');
//     if (!emailOrPhone) {
//       setError('Please enter an email or phone number');
//       return;
//     }
//     setIsLoading(true);
//     try {
//       const result = await sendOtp(emailOrPhone);
//       setIsLoading(false);
//       if (result.success) {
//         setOtpSent(true);
//         setSuccess(result.message);
//       } else {
//         setError(result.message);
//       }
//     } catch (error) {
//       setIsLoading(false);
//       setError('Failed to connect to the server. Please try again later.');
//       console.error('Send OTP error:', error);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setSuccess('');
//     setIsLoading(true);

//     try {
//       if (useOtp && otpSent) {
//         if (!otp) {
//           setError('Please enter the OTP');
//           setIsLoading(false);
//           return;
//         }
//         const result = await loginWithOtp(emailOrPhone, otp);
//         setIsLoading(false);
//         if (result.success) {
//           setSuccess(result.message);
//           navigate('/');
//         } else {
//           setError(result.message);
//         }
//       } else {
//         if (!password) {
//           setError('Please enter a password');
//           setIsLoading(false);
//           return;
//         }
//         const result = await login(emailOrPhone, password);
//         setIsLoading(false);
//         if (result.success) {
//           setSuccess(result.message);
//           navigate('/');
//         } else {
//           setError(result.message);
//         }
//       }
//     } catch (error) {
//       setIsLoading(false);
//       setError('Failed to connect to the server. Please try again later.');
//       console.error('Submission error:', error);
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
//       transition: { duration: 0.4, ease: 'easeOut' },
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
//             Welcome to E-Shop
//           </h2>
//           <p className="mt-2 text-center text-sm text-gray-600">Sign in to continue</p>
//         </div>
//         <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
//           <div className="space-y-4">
//             <motion.div variants={inputVariants} className="relative">
//               <input
//                 id="email-or-phone"
//                 name="emailOrPhone"
//                 type="text"
//                 required
//                 className="peer w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-transparent disabled:bg-gray-200 disabled:cursor-not-allowed"
//                 placeholder="Email or Phone"
//                 value={emailOrPhone}
//                 onChange={(e) => setEmailOrPhone(e.target.value)}
//                 disabled={otpSent || isLoading}
//               />
//               <label
//                 htmlFor="email-or-phone"
//                 className="absolute left-4 -top-2.5 text-sm text-gray-600 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-indigo-600 bg-white px-1"
//               >
//                 Email or Phone
//               </label>
//             </motion.div>
//             {!useOtp && (
//               <motion.div variants={inputVariants} className="relative">
//                 <input
//                   id="password"
//                   name="password"
//                   type={showPassword ? 'text' : 'password'}
//                   required={!useOtp}
//                   className="peer w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-transparent"
//                   placeholder="Password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
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
//             )}
//             {useOtp && otpSent && (
//               <motion.div variants={inputVariants} className="relative">
//                 <input
//                   id="otp"
//                   name="otp"
//                   type="text"
//                   required
//                   className="peer w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-transparent"
//                   placeholder="Enter OTP"
//                   value={otp}
//                   onChange={(e) => setOtp(e.target.value)}
//                   disabled={isLoading}
//                 />
//                 <label
//                   htmlFor="otp"
//                   className="absolute left-4 -top-2.5 text-sm text-gray-600 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-indigo-600 bg-white px-1"
//                 >
//                   OTP
//                 </label>
//                 <button
//                   type="button"
//                   className="absolute right-3 top-3 text-sm text-indigo-600 hover:text-indigo-800"
//                   onClick={handleSendOtp}
//                   disabled={isLoading}
//                 >
//                   Resend OTP
//                 </button>
//               </motion.div>
//             )}
//           </div>

//           <div className="flex items-center justify-between">
//             <div className="flex items-center">
//               <input
//                 id="use-otp"
//                 name="use-otp"
//                 type="checkbox"
//                 className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded cursor-pointer"
//                 checked={useOtp}
//                 onChange={(e) => setUseOtp(e.target.checked)}
//                 disabled={otpSent || isLoading}
//               />
//               <label htmlFor="use-otp" className="ml-2 block text-sm text-gray-900">
//                 Login with OTP
//               </label>
//             </div>
//             {!useOtp && (
//               <div className="text-sm">
//                 <Link
//                   to="/forgot-password"
//                   className="font-medium text-indigo-600 hover:text-indigo-500"
//                 >
//                   Forgot password?
//                 </Link>
//               </div>
//             )}
//           </div>

//           <AnimatePresence>
//             {error && (
//               <motion.p
//                 className="text-red-500 text-sm text-center bg-red-100/80 p-2 rounded-lg"
//                 variants={messageVariants}
//                 initial="initial"
//                 animate="animate"
//                 exit="exit"
//               >
//                 {error}
//               </motion.p>
//             )}
//             {success && (
//               <motion.p
//                 className="text-green-500 text-sm text-center bg-green-100/80 p-2 rounded-lg"
//                 variants={messageVariants}
//                 initial="initial"
//                 animate="animate"
//                 exit="exit"
//               >
//                 {success}
//               </motion.p>
//             )}
//           </AnimatePresence>

//           <div>
//             {useOtp && !otpSent ? (
//               <motion.button
//                 type="button"
//                 className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
//                 onClick={handleSendOtp}
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 disabled={isLoading}
//               >
//                 {isLoading ? (
//                   <Loader className="animate-spin h-5 w-5" />
//                 ) : (
//                   'Send OTP'
//                 )}
//               </motion.button>
//             ) : (
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
//                   'Sign in'
//                 )}
//               </motion.button>
//             )}
//           </div>
//         </form>
//         <p className="mt-4 text-center text-sm text-gray-600">
//           Don't have an account?{' '}
//           <Link
//             to="/register"
//             className="font-medium text-indigo-600 hover:text-indigo-500"
//           >
//             Register now
//           </Link>
//         </p>
//       </motion.div>
//     </div>
//   );
// };

// export default Login;





























// import React, { useState, useContext } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { motion, AnimatePresence } from 'framer-motion';
// import { AuthContext } from '../context/AuthContext';
// import { Eye, EyeOff, Loader } from 'lucide-react';
// import AnimatedBackground from '../Background/BackgroundofLogin&Register/AnimatedBackground';

// const Login = () => {
//   const [emailOrPhone, setEmailOrPhone] = useState('');
//   const [password, setPassword] = useState('');
//   const [useOtp, setUseOtp] = useState(false);
//   const [otp, setOtp] = useState('');
//   const [otpSent, setOtpSent] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const { login, sendOtp, loginWithOtp } = useContext(AuthContext);
//   const navigate = useNavigate();

//   const handleSendOtp = async (e) => {
//     e.preventDefault();
//     setError('');
//     setSuccess('');
//     setIsLoading(true);
//     const result = await sendOtp(emailOrPhone);
//     setIsLoading(false);
//     if (result.success) {
//       setOtpSent(true);
//       setSuccess(result.message);
//     } else {
//       setError(result.message);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setSuccess('');
//     setIsLoading(true);

//     if (useOtp && otpSent) {
//       const result = await loginWithOtp(emailOrPhone, otp);
//       setIsLoading(false);
//       if (result.success) {
//         setSuccess(result.message);
//         navigate('/');
//       } else {
//         setError(result.message);
//       }
//     } else if (!useOtp) {
//       const result = await login(emailOrPhone, password);
//       setIsLoading(false);
//       if (result.success) {
//         setSuccess(result.message);
//         navigate('/');
//       } else {
//         setError(result.message);
//       }
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
//       transition: { duration: 0.4, ease: 'easeOut' },
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
//             Welcome to E-Shop
//           </h2>
//           <p className="mt-2 text-center text-sm text-gray-600">Sign in to continue</p>
//         </div>
//         <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
//           <div className="space-y-4">
//             <motion.div variants={inputVariants} className="relative">
//               <input
//                 id="email-or-phone"
//                 name="emailOrPhone"
//                 type="text"
//                 required
//                 className="peer w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-transparent disabled:bg-gray-200 disabled:cursor-not-allowed"
//                 placeholder="Email or Phone"
//                 value={emailOrPhone}
//                 onChange={(e) => setEmailOrPhone(e.target.value)}
//                 disabled={otpSent || isLoading}
//               />
//               <label
//                 htmlFor="email-or-phone"
//                 className="absolute left-4 -top-2.5 text-sm text-gray-600 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-indigo-600 bg-white px-1"
//               >
//                 Email or Phone
//               </label>
//             </motion.div>
//             {!useOtp && (
//               <motion.div variants={inputVariants} className="relative">
//                 <input
//                   id="password"
//                   name="password"
//                   type={showPassword ? 'text' : 'password'}
//                   required={!useOtp}
//                   className="peer w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-transparent"
//                   placeholder="Password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
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
//             )}
//             {useOtp && otpSent && (
//               <motion.div variants={inputVariants} className="relative">
//                 <input
//                   id="otp"
//                   name="otp"
//                   type="text"
//                   required
//                   className="peer w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-transparent"
//                   placeholder="Enter OTP"
//                   value={otp}
//                   onChange={(e) => setOtp(e.target.value)}
//                   disabled={isLoading}
//                 />
//                 <label
//                   htmlFor="otp"
//                   className="absolute left-4 -top-2.5 text-sm text-gray-600 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-indigo-600 bg-white px-1"
//                 >
//                   OTP
//                 </label>
//                 <button
//                   type="button"
//                   className="absolute right-3 top-3 text-sm text-indigo-600 hover:text-indigo-800"
//                   onClick={handleSendOtp}
//                   disabled={isLoading}
//                 >
//                   Resend OTP
//                 </button>
//               </motion.div>
//             )}
//           </div>

//           <div className="flex items-center justify-between">
//             <div className="flex items-center">
//               <input
//                 id="use-otp"
//                 name="use-otp"
//                 type="checkbox"
//                 className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded cursor-pointer"
//                 checked={useOtp}
//                 onChange={(e) => setUseOtp(e.target.checked)}
//                 disabled={otpSent || isLoading}
//               />
//               <label htmlFor="use-otp" className="ml-2 block text-sm text-gray-900">
//                 Login with OTP
//               </label>
//             </div>
//             {!useOtp && (
//               <div className="text-sm">
//                 <Link
//                   to="/forgot-password"
//                   className="font-medium text-indigo-600 hover:text-indigo-500"
//                 >
//                   Forgot password?
//                 </Link>
//               </div>
//             )}
//           </div>

//           <AnimatePresence>
//             {error && (
//               <motion.p
//                 className="text-red-500 text-sm text-center bg-red-100/80 p-2 rounded-lg"
//                 variants={messageVariants}
//                 initial="initial"
//                 animate="animate"
//                 exit="exit"
//               >
//                 {error}
//               </motion.p>
//             )}
//             {success && (
//               <motion.p
//                 className="text-green-500 text-sm text-center bg-green-100/80 p-2 rounded-lg"
//                 variants={messageVariants}
//                 initial="initial"
//                 animate="animate"
//                 exit="exit"
//               >
//                 {success}
//               </motion.p>
//             )}
//           </AnimatePresence>

//           <div>
//             {useOtp && !otpSent ? (
//               <motion.button
//                 type="button"
//                 className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
//                 onClick={handleSendOtp}
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 disabled={isLoading}
//               >
//                 {isLoading ? (
//                   <Loader className="animate-spin h-5 w-5" />
//                 ) : (
//                   'Send OTP'
//                 )}
//               </motion.button>
//             ) : (
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
//                   'Sign in'
//                 )}
//               </motion.button>
//             )}
//           </div>
//         </form>
//         <p className="mt-4 text-center text-sm text-gray-600">
//           Don't have an account?{' '}
//           <Link
//             to="/register"
//             className="font-medium text-indigo-600 hover:text-indigo-500"
//           >
//             Register now
//           </Link>
//         </p>
//       </motion.div>
//     </div>
//   );
// };

// export default Login;