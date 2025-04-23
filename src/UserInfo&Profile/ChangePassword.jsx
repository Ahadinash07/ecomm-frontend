import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import PasswordForm from './PasswordForm';
import { useNavigate } from 'react-router-dom';

const ChangePassword = () => {
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <motion.div
      key="change-password"
      className="container mx-auto py-6 px-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Change Password
        </h1>
        <button
          onClick={() => navigate('/')}
          className="text-blue-600 hover:underline text-sm font-medium"
        >
          Back to Home
        </button>
      </div>
      <div className="bg-white rounded-xl shadow-md p-6 max-w-sm mx-auto">
        {loading ? (
          <p className="text-gray-600 text-sm">Loading...</p>
        ) : user ? (
          <>
            <PasswordForm />
            <div className="mt-4 text-center">
              <button
                onClick={() => navigate('/forgot-password')}
                className="text-blue-600 hover:underline text-sm font-medium"
              >
                Forgot Password?
              </button>
            </div>
          </>
        ) : (
          <p className="text-red-500 text-sm">Please log in to change your password.</p>
        )}
      </div>
    </motion.div>
  );
};

export default ChangePassword;







































// import React, { useContext } from 'react';
// import { motion } from 'framer-motion';
// import { AuthContext } from '../context/AuthContext';
// import PasswordForm from './PasswordForm';
// import { useNavigate } from 'react-router-dom';



// const ChangePassword = () => {
//     const { user, loading } = useContext(AuthContext);
//     const navigate = useNavigate();
  
//     return (
//       <motion.div
//         className="container mx-auto py-6 px-4"
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//       >
//         <div className="flex items-center justify-between mb-4">
//           <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
//             Change Password
//           </h1>
//           <button
//             onClick={() => navigate('/')}
//             className="text-blue-600 hover:underline text-sm font-medium"
//           >
//             Back to Home
//           </button>
//         </div>
//         <div className="bg-white rounded-xl shadow-md p-6 max-w-sm mx-auto">
//           {loading ? (
//             <p className="text-gray-600 text-sm">Loading...</p>
//           ) : user ? (
//             <PasswordForm />
//           ) : (
//             <p className="text-red-500 text-sm">Please log in to change your password.</p>
//           )}
//         </div>
//       </motion.div>
//     );
//   };
  
//   export default ChangePassword;


// const ChangePassword = () => {
//   const { user, loading } = useContext(AuthContext);

//   return (
//     <motion.div
//       className="container mx-auto py-8 px-4"
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.5 }}
//     >
//       <h1 className="text-3xl font-bold mb-6 bg-white bg-clip-text text-transparent">
//         Change Password
//       </h1>
//       <div className="bg-white rounded-xl shadow-lg p-6 max-w-md mx-auto">
//         {loading ? (
//           <p className="text-gray-600">Loading...</p>
//         ) : user ? (
//           <PasswordForm />
//         ) : (
//           <p className="text-red-500">Please log in to change your password.</p>
//         )}
//       </div>
//     </motion.div>
//   );
// };

// export default ChangePassword;