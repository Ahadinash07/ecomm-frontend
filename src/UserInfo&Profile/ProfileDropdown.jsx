import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const ProfileDropdown = ({ isOpen, user, onClose, onLogout }) => {
  const navigate = useNavigate();

  const dropdownVariants = {
    initial: { opacity: 0, y: -10, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -10, scale: 0.95 },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-xl py-2 z-20 border border-gray-100"
          variants={dropdownVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <div className="px-4 py-3 text-gray-800 border-b border-gray-100">
            <p className="font-semibold text-lg">{user.first_name} {user.last_name}</p>
            <p className="text-sm text-gray-600 truncate">{user.email}</p>
          </div>
          <button
            className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
            onClick={() => {
              navigate('/profile/info');
              onClose();
            }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Profile Info
          </button>
          <button
            className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
            onClick={() => {
              navigate('/profile/password');
              onClose();
            }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0-1.1-.9-2-2-2H6c-1.1 0-2 .9-2 2v4c0 1.1.9 2 2 2h4c1.1 0 2-.9 2-2v-1m0-3v1m6-3h4m-4 0h-1m1 0v4" />
            </svg>
            Change Password
          </button>
          <button
            className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
            onClick={onLogout}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProfileDropdown;





























// import React from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { useNavigate } from 'react-router-dom';

// const ProfileDropdown = ({ isOpen, user, onClose, onLogout }) => {
//   const navigate = useNavigate();

//   const dropdownVariants = {
//     initial: { opacity: 0, y: -10, scale: 0.95 },
//     animate: { opacity: 1, y: 0, scale: 1 },
//     exit: { opacity: 0, y: -10, scale: 0.95 },
//   };

//   return (
//     <AnimatePresence>
//       {isOpen && (
//         <motion.div
//           className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-xl py-2 z-20 border border-gray-100"
//           variants={dropdownVariants}
//           initial="initial"
//           animate="animate"
//           exit="exit"
//         >
//           <div className="px-4 py-3 text-gray-800 border-b border-gray-100">
//             <p className="font-semibold text-lg">{user.first_name} {user.last_name}</p>
//             <p className="text-sm text-gray-600 truncate">{user.email}</p>
//           </div>
//           <button
//             className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
//             onClick={() => {
//               navigate('/profile');
//               onClose();
//             }}
//           >
//             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//             </svg>
//             Your Account
//           </button>
//           <button
//             className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
//             onClick={onLogout}
//           >
//             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
//             </svg>
//             Logout
//           </button>
//         </motion.div>
//       )}
//     </AnimatePresence>
//   );
// };

// export default ProfileDropdown;