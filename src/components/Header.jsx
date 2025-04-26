import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import ProfileDropdown from '../UserInfo&Profile/ProfileDropdown';
import { FaSearch } from 'react-icons/fa';
import { FiShoppingCart } from 'react-icons/fi';

// Enhanced Logo component with better navigation
const Logo = ({ onClick }) => {
  const letterVariants = {
    initial: { opacity: 0, y: 20 },
    animate: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.5 },
    }),
    hover: { y: -5, transition: { duration: 0.2 } },
  };

  const cartVariants = {
    initial: { scale: 0, rotate: -180 },
    animate: {
      scale: 1,
      rotate: 0,
      transition: { delay: 0.6, type: 'spring', stiffness: 100 },
    },
    hover: { scale: 1.2, rotate: 10, transition: { duration: 0.3 } },
  };

  const text = 'E-Shop';

  return (
    <motion.div
      key="logo"
      className="flex items-center h-12 cursor-pointer flex-shrink-0"
      variants={{
        initial: { scale: 0, opacity: 0 },
        animate: {
          scale: 1,
          opacity: 1,
          transition: { type: 'spring', stiffness: 260, damping: 20, duration: 0.5 },
        },
        hover: { scale: 1.05, transition: { type: 'spring', stiffness: 400 } },
      }}
      initial="initial"
      animate="animate"
      whileHover="hover"
      onClick={onClick}
    >
      <div className="flex">
        {text.split('').map((char, index) => (
          <motion.span
            key={`logo-char-${index}`}
            className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
            variants={letterVariants}
            custom={index}
          >
            {char}
          </motion.span>
        ))}
      </div>
      <motion.svg
        className="ml-1 w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        variants={cartVariants}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </motion.svg>
    </motion.div>
  );
};

class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <div className="text-red-500 text-center">Something went wrong with the logo.</div>;
    }
    return this.props.children;
  }
}

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, logout, cartCount } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleProfileClick = () => {
    setIsProfileOpen((prev) => !prev);
  };

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
    navigate('/');
  };

  const buttonVariants = {
    initial: { y: 20, opacity: 0 },
    animate: {
      y: 0,
      opacity: 1,
      transition: { delay: 0.3, duration: 0.4 },
    },
    hover: {
      scale: 1.1,
      transition: { type: 'spring', stiffness: 300 },
    },
  };

  const cartButtonVariants = {
    initial: { y: 20, opacity: 0 },
    animate: {
      y: 0,
      opacity: 1,
      transition: { delay: 0.4, duration: 0.4 },
    },
    hover: {
      scale: 1.1,
      transition: { type: 'spring', stiffness: 300 },
    },
  };

  const searchVariants = {
    initial: { width: 0, opacity: 0 },
    animate: {
      width: 'auto',
      opacity: 1,
      transition: { delay: 0.2, duration: 0.6, ease: 'easeOut' },
    },
  };

  return (
    <motion.header
      key="header"
      className="bg-white shadow-lg py-2 px-4 sticky top-0 z-50"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 120, damping: 15 }}
    >
      <div className="container mx-auto flex items-center justify-between gap-2">
        {/* Logo Section */}
        <div className="flex-shrink-0">
          <ErrorBoundary>
            <Logo onClick={() => navigate('/')} />
          </ErrorBoundary>
        </div>

        {/* Search Section */}
        <motion.form
          key="search-form"
          onSubmit={handleSearch}
          className="flex-1 min-w-0"
          variants={searchVariants}
          initial="initial"
          animate="animate"
        >
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <motion.button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-600 hover:text-blue-800"
            >
              <FaSearch />
            </motion.button>
          </div>
        </motion.form>

        {/* Auth Section */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Cart Button */}
          <motion.button
            key="cart-button"
            className="relative p-2 text-gray-700 hover:text-blue-900"
            variants={cartButtonVariants}
            initial="initial"
            animate="animate"
            whileHover="hover"
            onClick={() => navigate('/cart')}
          >
            <FiShoppingCart className="w-6 h-6 text-blue-600" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </motion.button>

          {user ? (
            <div className="relative">
              <motion.div
                key="profile-avatar"
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold cursor-pointer shadow-md"
                variants={buttonVariants}
                initial="initial"
                animate="animate"
                whileHover="hover"
                onClick={handleProfileClick}
              >
                {user.first_name?.charAt(0).toUpperCase() || 'U'}
              </motion.div>
              <ProfileDropdown
                isOpen={isProfileOpen}
                user={user}
                onClose={() => setIsProfileOpen(false)}
                onLogout={handleLogout}
              />
            </div>
          ) : (
            <>
              <motion.button
                key="login-button"
                className="px-2 py-1 text-sm text-gray-700 hover:text-blue-600 font-medium"
                variants={buttonVariants}
                initial="initial"
                animate="animate"
                whileHover="hover"
                onClick={() => navigate('/login')}
              >
                Login
              </motion.button>
              <motion.button
                key="register-button"
                className="px-2 py-1 text-sm bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium rounded shadow-sm hover:opacity-90"
                variants={buttonVariants}
                initial="initial"
                animate="animate"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/register')}
              >
                Register
              </motion.button>
            </>
          )}
        </div>
      </div>
    </motion.header>
  );
};

export default Header;




















































// import React, { useState, useContext, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { motion } from 'framer-motion';
// import { AuthContext } from '../context/AuthContext';
// import ProfileDropdown from '../UserInfo&Profile/ProfileDropdown';
// import { FaSearch } from 'react-icons/fa';
// import { FiShoppingCart } from 'react-icons/fi';
// import axios from 'axios';

// // Enhanced Logo component with better navigation
// const Logo = ({ onClick }) => {
//   const letterVariants = {
//     initial: { opacity: 0, y: 20 },
//     animate: (i) => ({
//       opacity: 1,
//       y: 0,
//       transition: { delay: i * 0.1, duration: 0.5 },
//     }),
//     hover: { y: -5, transition: { duration: 0.2 } },
//   };

//   const cartVariants = {
//     initial: { scale: 0, rotate: -180 },
//     animate: {
//       scale: 1,
//       rotate: 0,
//       transition: { delay: 0.6, type: 'spring', stiffness: 100 },
//     },
//     hover: { scale: 1.2, rotate: 10, transition: { duration: 0.3 } },
//   };

//   const text = 'E-Shop';

//   return (
//     <motion.div
//       key="logo"
//       className="flex items-center h-12 cursor-pointer flex-shrink-0"
//       variants={{
//         initial: { scale: 0, opacity: 0 },
//         animate: {
//           scale: 1,
//           opacity: 1,
//           transition: { type: 'spring', stiffness: 260, damping: 20, duration: 0.5 },
//         },
//         hover: { scale: 1.05, transition: { type: 'spring', stiffness: 400 } },
//       }}
//       initial="initial"
//       animate="animate"
//       whileHover="hover"
//       onClick={onClick}
//     >
//       <div className="flex">
//         {text.split('').map((char, index) => (
//           <motion.span
//             key={`logo-char-${index}`}
//             className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
//             variants={letterVariants}
//             custom={index}
//           >
//             {char}
//           </motion.span>
//         ))}
//       </div>
//       <motion.svg
//         className="ml-1 w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
//         fill="none"
//         stroke="currentColor"
//         viewBox="0 0 24 24"
//         variants={cartVariants}
//       >
//         <path
//           strokeLinecap="round"
//           strokeLinejoin="round"
//           strokeWidth="2"
//           d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
//         />
//       </motion.svg>
//     </motion.div>
//   );
// };

// class ErrorBoundary extends React.Component {
//   state = { hasError: false };

//   static getDerivedStateFromError() {
//     return { hasError: true };
//   }

//   render() {
//     if (this.state.hasError) {
//       return <div className="text-red-500 text-center">Something went wrong with the logo.</div>;
//     }
//     return this.props.children;
//   }
// }

// const Header = () => {
//   const [searchQuery, setSearchQuery] = useState('');
//   const [isProfileOpen, setIsProfileOpen] = useState(false);
//   const [cartCount, setCartCount] = useState(0);
//   const { user, logout } = useContext(AuthContext);
//   const navigate = useNavigate();
//   const API_URL = 'http://localhost:5376';

//   useEffect(() => {
//     const fetchCartCount = async () => {
//       if (user) {
//         try {
//           const token = localStorage.getItem('token');
//           const response = await axios.get(`${API_URL}/api/cart`, {
//             headers: { Authorization: `Bearer ${token}` },
//           });
//           const items = response.data.items || [];
//           const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
//           setCartCount(totalItems);
//         } catch (err) {
//           console.error('Error fetching cart count:', err);
//           setCartCount(0);
//         }
//       } else {
//         setCartCount(0);
//       }
//     };

//     fetchCartCount();
//   }, [user]);

//   const handleSearch = (e) => {
//     e.preventDefault();
//     if (searchQuery.trim()) {
//       navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
//     }
//   };

//   // Toggle profile dropdown
//   const handleProfileClick = () => {
//     setIsProfileOpen((prev) => !prev);
//   };

//   const handleLogout = () => {
//     logout();
//     setIsProfileOpen(false);
//     setCartCount(0); // Reset cart count on logout
//     navigate('/');
//   };

//   const buttonVariants = {
//     initial: { y: 20, opacity: 0 },
//     animate: {
//       y: 0,
//       opacity: 1,
//       transition: { delay: 0.3, duration: 0.4 },
//     },
//     hover: {
//       scale: 1.1,
//       transition: { type: 'spring', stiffness: 300 },
//     },
//   };

//   const cartButtonVariants = {
//     initial: { y: 20, opacity: 0 },
//     animate: {
//       y: 0,
//       opacity: 1,
//       transition: { delay: 0.4, duration: 0.4 },
//     },
//     hover: {
//       scale: 1.1,
//       transition: { type: 'spring', stiffness: 300 },
//     },
//   };

//   const searchVariants = {
//     initial: { width: 0, opacity: 0 },
//     animate: {
//       width: 'auto',
//       opacity: 1,
//       transition: { delay: 0.2, duration: 0.6, ease: 'easeOut' },
//     },
//   };

//   return (
//     <motion.header
//       key="header"
//       className="bg-white shadow-lg py-2 px-4 sticky top-0 z-50"
//       initial={{ y: -100 }}
//       animate={{ y: 0 }}
//       transition={{ type: 'spring', stiffness: 120, damping: 15 }}
//     >
//       <div className="container mx-auto flex items-center justify-between gap-2">
//         {/* Logo Section */}
//         <div className="flex-shrink-0">
//           <ErrorBoundary>
//             <Logo onClick={() => navigate('/')} />
//           </ErrorBoundary>
//         </div>

//         {/* Search Section */}
//         <motion.form
//           key="search-form"
//           onSubmit={handleSearch}
//           className="flex-1 min-w-0"
//           variants={searchVariants}
//           initial="initial"
//           animate="animate"
//         >
//           <div className="relative">
//             <input
//               type="text"
//               placeholder="Search..."
//               className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//             />
//             <motion.button
//               type="submit"
//               className="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-600 hover:text-blue-800"
//             >
//               <FaSearch />
//             </motion.button>
//           </div>
//         </motion.form>

//         {/* Auth Section */}
//         <div className="flex items-center gap-2 flex-shrink-0">
//           {/* Cart Button */}
//           <motion.button
//             key="cart-button"
//             className="relative p-2 text-gray-700 hover:text-blue-900"
//             variants={cartButtonVariants}
//             initial="initial"
//             animate="animate"
//             whileHover="hover"
//             onClick={() => navigate('/cart')}
//           >
//             <FiShoppingCart className="w-6 h-6 text-blue-600" />
//             {cartCount > 0 && (
//               <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
//                 {cartCount}
//               </span>
//             )}
//           </motion.button>

//           {user ? (
//             <div className="relative">
//               <motion.div
//                 key="profile-avatar"
//                 className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold cursor-pointer shadow-md"
//                 variants={buttonVariants}
//                 initial="initial"
//                 animate="animate"
//                 whileHover="hover"
//                 onClick={handleProfileClick}
//               >
//                 {user.first_name?.charAt(0).toUpperCase() || 'U'}
//               </motion.div>
//               <ProfileDropdown
//                 isOpen={isProfileOpen} // Fixed: Changed isOpenProfile to isProfileOpen
//                 user={user}
//                 onClose={() => setIsProfileOpen(false)}
//                 onLogout={handleLogout}
//               />
//             </div>
//           ) : (
//             <>
//               <motion.button
//                 key="login-button"
//                 className="px-2 py-1 text-sm text-gray-700 hover:text-blue-600 font-medium"
//                 variants={buttonVariants}
//                 initial="initial"
//                 animate="animate"
//                 whileHover="hover"
//                 onClick={() => navigate('/login')}
//               >
//                 Login
//               </motion.button>
//               <motion.button
//                 key="register-button"
//                 className="px-2 py-1 text-sm bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium rounded shadow-sm hover:opacity-90"
//                 variants={buttonVariants}
//                 initial="initial"
//                 animate="animate"
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 onClick={() => navigate('/register')}
//               >
//                 Register
//               </motion.button>
//             </>
//           )}
//         </div>
//       </div>
//     </motion.header>
//   );
// };

// export default Header;


















































// import React, { useState, useContext, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { motion } from 'framer-motion';
// import { AuthContext } from '../context/AuthContext';
// import ProfileDropdown from '../UserInfo&Profile/ProfileDropdown';
// import { FaSearch } from 'react-icons/fa';
// import { FiShoppingCart } from 'react-icons/fi';
// import axios from 'axios';

// // Enhanced Logo component with better navigation
// const Logo = ({ onClick }) => {
//   const letterVariants = {
//     initial: { opacity: 0, y: 20 },
//     animate: (i) => ({
//       opacity: 1,
//       y: 0,
//       transition: { delay: i * 0.1, duration: 0.5 },
//     }),
//     hover: { y: -5, transition: { duration: 0.2 } },
//   };

//   const cartVariants = {
//     initial: { scale: 0, rotate: -180 },
//     animate: {
//       scale: 1,
//       rotate: 0,
//       transition: { delay: 0.6, type: 'spring', stiffness: 100 },
//     },
//     hover: { scale: 1.2, rotate: 10, transition: { duration: 0.3 } },
//   };

//   const text = 'E-Shop';

//   return (
//     <motion.div
//       key="logo"
//       className="flex items-center h-12 cursor-pointer flex-shrink-0"
//       variants={{
//         initial: { scale: 0, opacity: 0 },
//         animate: {
//           scale: 1,
//           opacity: 1,
//           transition: { type: 'spring', stiffness: 260, damping: 20, duration: 0.5 },
//         },
//         hover: { scale: 1.05, transition: { type: 'spring', stiffness: 400 } },
//       }}
//       initial="initial"
//       animate="animate"
//       whileHover="hover"
//       onClick={onClick}
//     >
//       <div className="flex">
//         {text.split('').map((char, index) => (
//           <motion.span
//             key={`logo-char-${index}`}
//             className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
//             variants={letterVariants}
//             custom={index}
//           >
//             {char}
//           </motion.span>
//         ))}
//       </div>
//       <motion.svg
//         className="ml-1 w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
//         fill="none"
//         stroke="currentColor"
//         viewBox="0 0 24 24"
//         variants={cartVariants}
//       >
//         <path
//           strokeLinecap="round"
//           strokeLinejoin="round"
//           strokeWidth="2"
//           d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
//         />
//       </motion.svg>
//     </motion.div>
//   );
// };

// class ErrorBoundary extends React.Component {
//   state = { hasError: false };

//   static getDerivedStateFromError() {
//     return { hasError: true };
//   }

//   render() {
//     if (this.state.hasError) {
//       return <div className="text-red-500 text-center">Something went wrong with the logo.</div>;
//     }
//     return this.props.children;
//   }
// }

// const Header = () => {
//   const [searchQuery, setSearchQuery] = useState('');
//   const [isProfileOpen, setIsProfileOpen] = useState(false);
//   const [cartCount, setCartCount] = useState(0);
//   const { user, logout } = useContext(AuthContext);
//   const navigate = useNavigate();
//   const API_URL = 'http://localhost:5376';

//   useEffect(() => {
//     const fetchCartCount = async () => {
//       if (user) {
//         try {
//           const token = localStorage.getItem('token');
//           const response = await axios.get(`${API_URL}/api/cart`, {
//             headers: { Authorization: `Bearer ${token}` },
//           });
//           const items = response.data.items || [];
//           const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
//           setCartCount(totalItems);
//         } catch (err) {
//           console.error('Error fetching cart count:', err);
//           setCartCount(0);
//         }
//       } else {
//         setCartCount(0);
//       }
//     };

//     fetchCartCount();
//   }, [user]);

//   const handleSearch = (e) => {
//     e.preventDefault();
//     if (searchQuery.trim()) {
//       navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
//     }
//   };

//   const handleProfileClick = () => {
//     setIsProfileOpen(!isProfileOpen);
//   };

//   const handleLogout = () => {
//     logout();
//     setIsProfileOpen(false);
//     setCartCount(0); // Reset cart count on logout
//     navigate('/');
//   };

//   const buttonVariants = {
//     initial: { y: 20, opacity: 0 },
//     animate: {
//       y: 0,
//       opacity: 1,
//       transition: { delay: 0.3, duration: 0.4 },
//     },
//     hover: {
//       scale: 1.1,
//       transition: { type: 'spring', stiffness: 300 },
//     },
//   };

//   const cartButtonVariants = {
//     initial: { y: 20, opacity: 0 },
//     animate: {
//       y: 0,
//       opacity: 1,
//       transition: { delay: 0.4, duration: 0.4 },
//     },
//     hover: {
//       scale: 1.1,
//       transition: { type: 'spring', stiffness: 300 },
//     },
//   };

//   const searchVariants = {
//     initial: { width: 0, opacity: 0 },
//     animate: {
//       width: 'auto',
//       opacity: 1,
//       transition: { delay: 0.2, duration: 0.6, ease: 'easeOut' },
//     },
//   };

//   return (
//     <motion.header
//       key="header"
//       className="bg-white shadow-lg py-2 px-4 sticky top-0 z-50"
//       initial={{ y: -100 }}
//       animate={{ y: 0 }}
//       transition={{ type: 'spring', stiffness: 120, damping: 15 }}
//     >
//       <div className="container mx-auto flex items-center justify-between gap-2">
//         {/* Logo Section */}
//         <div className="flex-shrink-0">
//           <ErrorBoundary>
//             <Logo onClick={() => navigate('/')} />
//           </ErrorBoundary>
//         </div>

//         {/* Search Section */}
//         <motion.form
//           key="search-form"
//           onSubmit={handleSearch}
//           className="flex-1 min-w-0"
//           variants={searchVariants}
//           initial="initial"
//           animate="animate"
//         >
//           <div className="relative">
//             <input
//               type="text"
//               placeholder="Search..."
//               className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//             />
//             <motion.button
//               type="submit"
//               className="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-600 hover:text-blue-800"
//             >
//               <FaSearch />
//             </motion.button>
//           </div>
//         </motion.form>

//         {/* Auth Section */}
//         <div className="flex items-center gap-2 flex-shrink-0">
//           {/* Cart Button */}
//           <motion.button
//             key="cart-button"
//             className="relative p-2 text-gray-700 hover:text-blue-900"
//             variants={cartButtonVariants}
//             initial="initial"
//             animate="animate"
//             whileHover="hover"
//             onClick={() => navigate('/cart')}
//           >
//             <FiShoppingCart className="w-6 h-6 text-blue-600" />
//             {cartCount > 0 && (
//               <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
//                 {cartCount}
//               </span>
//             )}
//           </motion.button>

//           {user ? (
//             <div className="relative">
//               <motion.div
//                 key="profile-avatar"
//                 className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold cursor-pointer shadow-md"
//                 variants={buttonVariants}
//                 initial="initial"
//                 animate="animate"
//                 whileHover="hover"
//                 onClick={handleProfileClick}
//               >
//                 {user.first_name?.charAt(0).toUpperCase() || 'U'}
//               </motion.div>
//               <ProfileDropdown
//                 isOpen={isProfileOpen}
//                 user={user}
//                 onClose={() => setIsProfileOpen(false)}
//                 onLogout={handleLogout}
//               />
//             </div>
//           ) : (
//             <>
//               <motion.button
//                 key="login-button"
//                 className="px-2 py-1 text-sm text-gray-700 hover:text-blue-600 font-medium"
//                 variants={buttonVariants}
//                 initial="initial"
//                 animate="animate"
//                 whileHover="hover"
//                 onClick={() => navigate('/login')}
//               >
//                 Login
//               </motion.button>
//               <motion.button
//                 key="register-button"
//                 className="px-2 py-1 text-sm bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium rounded shadow-sm hover:opacity-90"
//                 variants={buttonVariants}
//                 initial="initial"
//                 animate="animate"
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 onClick={() => navigate('/register')}
//               >
//                 Register
//               </motion.button>
//             </>
//           )}
//         </div>
//       </div>
//     </motion.header>
//   );
// };

// export default Header;





























// import React, { useState, useContext } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { motion } from 'framer-motion';
// import { AuthContext } from '../context/AuthContext';
// import ProfileDropdown from '../UserInfo&Profile/ProfileDropdown';


// // Enhanced Logo component with better navigation
// const Logo = ({ onClick }) => {
//   const letterVariants = {
//     initial: { opacity: 0, y: 20 },
//     animate: (i) => ({
//       opacity: 1,
//       y: 0,
//       transition: { delay: i * 0.1, duration: 0.5 },
//     }),
//     hover: { y: -5, transition: { duration: 0.2 } },
//   };

//   const cartVariants = {
//     initial: { scale: 0, rotate: -180 },
//     animate: {
//       scale: 1,
//       rotate: 0,
//       transition: { delay: 0.6, type: 'spring', stiffness: 100 },
//     },
//     hover: { scale: 1.2, rotate: 10, transition: { duration: 0.3 } },
//   };

//   const text = 'E-Shop';

//   return (
//     <motion.div
//       className="flex items-center h-12 cursor-pointer"
//       variants={{
//         initial: { scale: 0, opacity: 0 },
//         animate: {
//           scale: 1,
//           opacity: 1,
//           transition: { type: 'spring', stiffness: 260, damping: 20, duration: 0.5 },
//         },
//         hover: { scale: 1.05, transition: { type: 'spring', stiffness: 400 } },
//       }}
//       initial="initial"
//       animate="animate"
//       whileHover="hover"
//       onClick={onClick}
//     >
//       <div className="flex">
//         {text.split('').map((char, index) => (
//           <motion.span
//             key={index}
//             className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
//             variants={letterVariants}
//             custom={index}
//           >
//             {char}
//           </motion.span>
//         ))}
//       </div>
//       <motion.svg
//         className="ml-2 w-9 h-9 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
//         fill="none"
//         stroke="currentColor"
//         viewBox="0 0 24 24"
//         variants={cartVariants}
//       >
//         <path
//           strokeLinecap="round"
//           strokeLinejoin="round"
//           strokeWidth="2"
//           d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
//         />
//       </motion.svg>
//     </motion.div>
//   );
// };

// class ErrorBoundary extends React.Component {
//   state = { hasError: false };

//   static getDerivedStateFromError() {
//     return { hasError: true };
//   }

//   render() {
//     if (this.state.hasError) {
//       return <div className="text-red-500 text-center">Something went wrong with the logo.</div>;
//     }
//     return this.props.children;
//   }
// }

// const Header = () => {
//   const [searchQuery, setSearchQuery] = useState('');
//   const [isProfileOpen, setIsProfileOpen] = useState(false);
//   const { user, logout } = useContext(AuthContext);
//   const navigate = useNavigate();

//   const handleSearch = (e) => {
//     e.preventDefault();
//     if (searchQuery.trim()) {
//       navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
//     }
//   };

//   const handleProfileClick = () => {
//     setIsProfileOpen(!isProfileOpen);
//   };

//   const handleLogout = () => {
//     logout();
//     setIsProfileOpen(false);
//     navigate('/');
//   };

//   const buttonVariants = {
//     initial: { y: 20, opacity: 0 },
//     animate: {
//       y: 0,
//       opacity: 1,
//       transition: { delay: 0.3, duration: 0.4 },
//     },
//     hover: {
//       scale: 1.1,
//       transition: { type: 'spring', stiffness: 300 },
//     },
//   };

//   const searchVariants = {
//     initial: { width: 0, opacity: 0 },
//     animate: {
//       width: '100%',
//       opacity: 1,
//       transition: { delay: 0.2, duration: 0.6, ease: 'easeOut' },
//     },
//   };

//   return (
//     <motion.header
//       className="bg-white shadow-lg py-4 px-6 sticky top-0 z-50"
//       initial={{ y: -100 }}
//       animate={{ y: 0 }}
//       transition={{ type: 'spring', stiffness: 120, damping: 15 }}
//     >
//       <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
//         {/* Logo Section */}
//         <div className="flex items-center">
//           <ErrorBoundary>
//             <Logo onClick={() => navigate('/')} />
//           </ErrorBoundary>
//         </div>

//         {/* Search Section */}
//         <motion.form
//           onSubmit={handleSearch}
//           className="w-full md:w-1/2"
//           variants={searchVariants}
//           initial="initial"
//           animate="animate"
//         >
//           <div className="relative">
//             <input
//               type="text"
//               placeholder="Find Your Product..."
//               className="w-full px-5 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//             />
//             <motion.button
//               type="submit"
//               className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
//             >
//               Search
//             </motion.button>
//           </div>
//         </motion.form>

//         {/* Auth Section */}
//         <div className="flex items-center gap-4">
//           {user ? (
//             <div className="relative">
//               <motion.div
//                 className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold cursor-pointer shadow-md"
//                 variants={buttonVariants}
//                 initial="initial"
//                 animate="animate"
//                 whileHover="hover"
//                 onClick={handleProfileClick}
//               >
//                 {user.first_name?.charAt(0).toUpperCase() || 'U'}
//               </motion.div>
//               <ProfileDropdown
//                 isOpen={isProfileOpen}
//                 user={user}
//                 onClose={() => setIsProfileOpen(false)}
//                 onLogout={handleLogout}
//               />
//             </div>
//           ) : (
//             <>
//               <motion.button
//                 className="px-6 py-2.5 text-gray-700 hover:text-blue-600 font-medium rounded-lg transition-colors"
//                 variants={buttonVariants}
//                 initial="initial"
//                 animate="animate"
//                 whileHover="hover"
//                 onClick={() => navigate('/login')}
//               >
//                 Login
//               </motion.button>
//               <motion.button
//                 className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium rounded-lg shadow-md hover:opacity-90 transition-opacity"
//                 variants={buttonVariants}
//                 initial="initial"
//                 animate="animate"
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 onClick={() => navigate('/register')}
//               >
//                 Register
//               </motion.button>
//             </>
//           )}
//         </div>
//       </div>
//     </motion.header>
//   );
// };

// export default Header;




// import React, { useState, useContext } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { motion, AnimatePresence } from 'framer-motion';
// import { AuthContext } from '../context/AuthContext';

// // Logo component (unchanged)
// const Logo = () => {
//   const letterVariants = {
//     initial: { opacity: 0, y: 20 },
//     animate: (i) => ({
//       opacity: 1,
//       y: 0,
//       transition: { delay: i * 0.1, duration: 0.5 },
//     }),
//     hover: { y: -2, transition: { duration: 0.2 } },
//   };

//   const cartVariants = {
//     initial: { scale: 0, rotate: -180 },
//     animate: {
//       scale: 1,
//       rotate: 0,
//       transition: { delay: 0.6, type: 'spring', stiffness: 100 },
//     },
//     hover: { scale: 1.2, rotate: 5, transition: { duration: 0.3 } },
//   };

//   const text = 'E-Shop';

//   return (
//     <motion.div
//       className="flex items-center h-10 cursor-pointer"
//       variants={{
//         initial: { scale: 0, opacity: 0 },
//         animate: {
//           scale: 1,
//           opacity: 1,
//           transition: { type: 'spring', stiffness: 260, damping: 20, duration: 0.5 },
//         },
//         hover: { scale: 1.1, transition: { type: 'spring', stiffness: 400 } },
//       }}
//       initial="initial"
//       animate="animate"
//       whileHover="hover"
//     >
//       <div className="flex">
//         {text.split('').map((char, index) => (
//           <motion.span
//             key={index}
//             className="text-2xl font-bold text-blue-600"
//             variants={letterVariants}
//             custom={index}
//           >
//             {char}
//           </motion.span>
//         ))}
//       </div>
//       <motion.svg
//         className="ml-2 w-8 h-8 text-blue-600"
//         fill="none"
//         stroke="currentColor"
//         viewBox="0 0 24 24"
//         variants={cartVariants}
//       >
//         <path
//           strokeLinecap="round"
//           strokeLinejoin="round"
//           strokeWidth="2"
//           d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
//         />
//       </motion.svg>
//     </motion.div>
//   );
// };

// // Error Boundary component (unchanged)
// class ErrorBoundary extends React.Component {
//   state = { hasError: false };

//   static getDerivedStateFromError() {
//     return { hasError: true };
//   }

//   render() {
//     if (this.state.hasError) {
//       return <div className="text-red-500 text-center">Something went wrong with the logo.</div>;
//     }
//     return this.props.children;
//   }
// }

// const Header = () => {
//   const [searchQuery, setSearchQuery] = useState('');
//   const [isProfileOpen, setIsProfileOpen] = useState(false);
//   const { user, logout } = useContext(AuthContext);
//   const navigate = useNavigate();

//   const handleSearch = (e) => {
//     e.preventDefault();
//     if (searchQuery.trim()) {
//       navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
//     }
//   };

//   const handleProfileClick = () => {
//     setIsProfileOpen(!isProfileOpen);
//   };

//   const handleLogout = () => {
//     logout();
//     setIsProfileOpen(false);
//   };

//   const buttonVariants = {
//     initial: { y: 20, opacity: 0 },
//     animate: {
//       y: 0,
//       opacity: 1,
//       transition: { delay: 0.3, duration: 0.4 },
//     },
//     hover: {
//       scale: 1.2,
//       transition: { type: 'spring', stiffness: 300 },
//     },
//   };

//   const searchVariants = {
//     initial: { width: 0, opacity: 0 },
//     animate: {
//       width: '100%',
//       opacity: 1,
//       transition: { delay: 0.2, duration: 0.6, ease: 'easeOut' },
//     },
//   };

//   const dropdownVariants = {
//     initial: { opacity: 0, y: -10 },
//     animate: { opacity: 1, y: 0 },
//     exit: { opacity: 0, y: -10 },
//   };

//   return (
//     <motion.header
//       className="bg-white shadow-md py-4 px-6"
//       initial={{ y: -100 }}
//       animate={{ y: 0 }}
//       transition={{ type: 'spring', stiffness: 100 }}
//     >
//       <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
//         <div className="flex items-center mb-4 md:mb-0">
//           <ErrorBoundary>
//             <Logo onClick={() => navigate('/')} />
//           </ErrorBoundary>
//         </div>

//         <motion.form
//           onSubmit={handleSearch}
//           className="w-full md:w-1/2"
//           variants={searchVariants}
//           initial="initial"
//           animate="animate"
//         >
//           <div className="relative">
//             <input
//               type="text"
//               placeholder="Find Your Product..."
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//             />
//             <motion.button
//               type="submit"
//               className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white px-4 py-1 rounded-md hover:bg-blue-600"
//             >
//               Search
//             </motion.button>
//           </div>
//         </motion.form>

//         <div className="flex items-center mt-4 md:mt-0 relative">
//           {user ? (
//             <div className="relative">
//               <motion.div
//                 className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold cursor-pointer"
//                 variants={buttonVariants}
//                 initial="initial"
//                 animate="animate"
//                 whileHover="hover"
//                 onClick={handleProfileClick}
//               >
//                 {user.first_name?.charAt(0).toUpperCase() || 'U'}
//               </motion.div>
//               <AnimatePresence>
//                 {isProfileOpen && (
//                   <motion.div
//                     className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-20"
//                     variants={dropdownVariants}
//                     initial="initial"
//                     animate="animate"
//                     exit="exit"
//                   >
//                     <div className="px-4 py-2 text-gray-800 border-b">
//                       <p className="font-semibold">{user.first_name} {user.last_name}</p>
//                       <p className="text-sm text-gray-600">{user.email}</p>
//                     </div>
//                     <button
//                       className="w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
//                       onClick={() => {
//                         navigate('/profile');
//                         setIsProfileOpen(false);
//                       }}
//                     >
//                       Your Account
//                     </button>
//                     <button
//                       className="w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
//                       onClick={handleLogout}
//                     >
//                       Logout
//                     </button>
//                   </motion.div>
//                 )}
//               </AnimatePresence>
//             </div>
//           ) : (
//             <>
//               <motion.button
//                 className="mx-2 text-gray-700 hover:text-blue-500"
//                 variants={buttonVariants}
//                 initial="initial"
//                 animate="animate"
//                 whileHover="hover"
//                 onClick={() => navigate('/login')}
//               >
//                 Login
//               </motion.button>
//               <motion.button
//                 className="mx-2 text-gray-700 hover:text-blue-500"
//                 variants={buttonVariants}
//                 initial="initial"
//                 animate="animate"
//                 whileHover="hover"
//                 onClick={() => navigate('/register')}
//               >
//                 Register
//               </motion.button>
//             </>
//           )}
//         </div>
//       </div>
//     </motion.header>
//   );
// };

// export default Header;





























// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { motion } from 'framer-motion';

// // Logo component with Framer Motion animations
// const Logo = () => {
//   const letterVariants = {
//     initial: { opacity: 0, y: 20 },
//     animate: (i) => ({
//       opacity: 1,
//       y: 0,
//       transition: { delay: i * 0.1, duration: 0.5 },
//     }),
//     hover: { y: -2, transition: { duration: 0.2 } },
//   };

//   const cartVariants = {
//     initial: { scale: 0, rotate: -180 },
//     animate: {
//       scale: 1,
//       rotate: 0,
//       transition: { delay: 0.6, type: 'spring', stiffness: 100 },
//     },
//     hover: { scale: 1.2, rotate: 5, transition: { duration: 0.3 } },
//   };

//   const text = 'E-Shop';

//   return (
//     <motion.div
//       className="flex items-center h-10 cursor-pointer"
//       variants={{
//         initial: { scale: 0, opacity: 0 },
//         animate: {
//           scale: 1,
//           opacity: 1,
//           transition: { type: 'spring', stiffness: 260, damping: 20, duration: 0.5 },
//         },
//         hover: { scale: 1.1, transition: { type: 'spring', stiffness: 400 } },
//       }}
//       initial="initial"
//       animate="animate"
//       whileHover="hover"
//     >
//       <div className="flex">
//         {text.split('').map((char, index) => (
//           <motion.span
//             key={index}
//             className="text-2xl font-bold text-blue-600"
//             variants={letterVariants}
//             custom={index}
//           >
//             {char}
//           </motion.span>
//         ))}
//       </div>
//       <motion.svg
//         className="ml-2 w-8 h-8 text-blue-600"
//         fill="none"
//         stroke="currentColor"
//         viewBox="0 0 24 24"
//         variants={cartVariants}
//       >
//         <path
//           strokeLinecap="round"
//           strokeLinejoin="round"
//           strokeWidth="2"
//           d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
//         />
//       </motion.svg>
//     </motion.div>
//   );
// };

// // Error Boundary component
// class ErrorBoundary extends React.Component {
//   state = { hasError: false };

//   static getDerivedStateFromError() {
//     return { hasError: true };
//   }

//   render() {
//     if (this.state.hasError) {
//       return <div className="text-red-500 text-center">Something went wrong with the logo.</div>;
//     }
//     return this.props.children;
//   }
// }

// const Header = () => {
//   const [searchQuery, setSearchQuery] = useState('');
//   const navigate = useNavigate();

//   const handleSearch = (e) => {
//     e.preventDefault();
//     if (searchQuery.trim()) {
//       navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
//     }
//   };

//   // Animation variants for buttons
//   const buttonVariants = {
//     initial: { y: 20, opacity: 0 },
//     animate: {
//       y: 0,
//       opacity: 1,
//       transition: { delay: 0.3, duration: 0.4 },
//     },
//     hover: {
//       scale: 1.2,
//       transition: { type: 'spring', stiffness: 300 },
//     },
//   };

//   // Animation variants for search bar
//   const searchVariants = {
//     initial: { width: 0, opacity: 0 },
//     animate: {
//       width: '100%',
//       opacity: 1,
//       transition: { delay: 0.2, duration: 0.6, ease: 'easeOut' },
//     },
//   };

//   return (
//     <motion.header
//       className="bg-white shadow-md py-4 px-6"
//       initial={{ y: -100 }}
//       animate={{ y: 0 }}
//       transition={{ type: 'spring', stiffness: 100 }}
//     >
//       <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
//         <div className="flex items-center mb-4 md:mb-0">
//           <ErrorBoundary>
//             <Logo onClick={() => navigate('/')} />
//           </ErrorBoundary>
//         </div>

//         <motion.form
//           onSubmit={handleSearch}
//           className="w-full md:w-1/2"
//           variants={searchVariants}
//           initial="initial"
//           animate="animate"
//         >
//           <div className="relative">
//             <input
//               type="text"
//               placeholder="Find Your Product..."
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//             />
//             <motion.button
//               type="submit"
//               className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white px-4 py-1 rounded-md hover:bg-blue-600"
//               // whileHover={{ scale: 1.05 }}
//               // whileTap={{ scale: 0.95 }}
//             >
//               Search
//             </motion.button>
//           </div>
//         </motion.form>

//         <div className="flex items-center mt-4 md:mt-0">
//           <motion.button
//             className="mx-2 text-gray-700 hover:text-blue-500"
//             variants={buttonVariants}
//             initial="initial"
//             animate="animate"
//             whileHover="hover"
//           >
//             <i className="fas fa-user text-xl"></i>
//           </motion.button>
//           {/* <motion.button
//             className="mx-2 text-gray-700 hover:text-blue-500 relative"
//             variants={buttonVariants}
//             initial="initial"
//             animate="animate"
//             whileHover="hover"
//           >
//             <i className="fas fa-shopping-cart text-xl"></i>
//             <motion.span
//               className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
//               initial={{ scale: 0 }}
//               animate={{ scale: 1 }}
//               transition={{ delay: 0.5, type: 'spring' }}
//             >
//               0
//             </motion.span>
//           </motion.button> */}
//         </div>
//       </div>
//     </motion.header>
//   );
// };

// export default Header;