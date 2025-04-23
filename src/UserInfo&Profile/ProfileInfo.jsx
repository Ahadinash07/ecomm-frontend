import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import ProfileInfoForm from './ProfileInfoForm';
import { useNavigate } from 'react-router-dom';


const ProfileInfo = () => {
    const { user, loading } = useContext(AuthContext);
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
            Profile Information
          </h1>
          <button
            onClick={() => navigate('/')}
            className="text-blue-600 hover:underline text-sm font-medium"
          >
            Back to Home
          </button>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 max-w-md mx-auto">
          {loading ? (
            <p className="text-gray-600 text-sm">Loading...</p>
          ) : user ? (
            <ProfileInfoForm user={user} />
          ) : (
            <p className="text-red-500 text-sm">Please log in to view your profile.</p>
          )}
        </div>
      </motion.div>
    );
  };
  
  export default ProfileInfo;































// const ProfileInfo = () => {
//     const { user, loading } = useContext(AuthContext);
//     const navigate = useNavigate();
  
//     return (
//       <motion.div
//         className="container mx-auto py-8 px-4"
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//       >
//         <div className="flex items-center justify-between mb-6">
//           <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
//             Profile Information
//           </h1>
//           <button
//             onClick={() => navigate('/')}
//             className="text-blue-600 hover:underline text-sm"
//           >
//             Back to Home
//           </button>
//         </div>
//         <div className="bg-white rounded-xl shadow-lg p-6 max-w-3xl mx-auto">
//           {loading ? (
//             <p className="text-gray-600">Loading...</p>
//           ) : user ? (
//             <ProfileInfoForm user={user} />
//           ) : (
//             <p className="text-red-500">Please log in to view your profile.</p>
//           )}
//         </div>
//       </motion.div>
//     );
//   };
  
//   export default ProfileInfo;
































// const ProfileInfo = () => {
//   const { user, loading } = useContext(AuthContext);

//   return (
//     <motion.div
//       className="container mx-auto py-8 px-4"
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.5 }}
//     >
//       <h1 className="text-3xl font-bold mb-6 bg-white bg-clip-text text-transparent">
//         Profile Information
//       </h1>
//       <div className="bg-white rounded-xl shadow-lg p-6 max-w-2xl mx-auto">
//         {loading ? (
//           <p className="text-gray-600">Loading...</p>
//         ) : user ? (
//           <ProfileInfoForm user={user} />
//         ) : (
//           <p className="text-red-500">Please log in to view your profile.</p>
//         )}
//       </div>
//     </motion.div>
//   );
// };

// export default ProfileInfo;