import React, { useState, useContext, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { CountrySelect, StateSelect, CitySelect } from 'react-country-state-city';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCity, FaGlobe, FaFlag, FaMailBulk } from 'react-icons/fa';

const ProfileInfoForm = ({ user }) => {
    const { updateUser } = useContext(AuthContext);
    const [formData, setFormData] = useState({
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      email: user.email || '',
      phone: user.phone || '',
      city: user.city || '',
      zip_code: user.zip_code || '',
      state: user.state || '',
      country: user.country || '',
    });
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [selectedState, setSelectedState] = useState(null);
    const [selectedCity, setSelectedCity] = useState(null);
    const [useManualCity, setUseManualCity] = useState(!!formData.city);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    // Initialize dropdowns with user's existing data
    useEffect(() => {
      if (formData.city && !selectedCity) {
        setUseManualCity(true);
      }
    }, [formData.city, selectedCity]);

    // Prevent page scroll when interacting with dropdowns
    useEffect(() => {
      const preventScroll = (e) => {
        const target = e.target.closest('.custom-dropdown');
        if (target) {
          e.preventDefault();
          e.stopPropagation();
        }
      };

      const handleWheel = (e) => {
        const target = e.target.closest('.custom-dropdown');
        if (target) {
          const list = target.querySelector('.dropdown-menu');
          if (list) {
            list.scrollTop += e.deltaY;
            e.preventDefault();
            e.stopPropagation();
          }
        }
      };

      const handleKeyDown = (e) => {
        const target = e.target.closest('.custom-dropdown');
        if (target && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
          const list = target.querySelector('.dropdown-menu');
          if (list) {
            list.scrollTop += e.key === 'ArrowDown' ? 20 : -20;
            e.preventDefault();
            e.stopPropagation();
          }
        }
      };

      document.addEventListener('wheel', handleWheel, { passive: false });
      document.addEventListener('touchmove', preventScroll, { passive: false });
      document.addEventListener('keydown', handleKeyDown, { passive: false });

      return () => {
        document.removeEventListener('wheel', handleWheel);
        document.removeEventListener('touchmove', preventScroll);
        document.removeEventListener('keydown', handleKeyDown);
      };
    }, []);

    const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCountryChange = (country) => {
      setSelectedCountry(country);
      setSelectedState(null);
      setSelectedCity(null);
      setFormData({
        ...formData,
        country: country ? country.name : '',
        state: '',
        city: '',
      });
    };

    const handleStateChange = (state) => {
      setSelectedState(state);
      setSelectedCity(null);
      setFormData({
        ...formData,
        state: state ? state.name : '',
        city: '',
      });
    };

    const handleCityChange = (city) => {
      setSelectedCity(city);
      setFormData({
        ...formData,
        city: city ? city.name : '',
        state: city && selectedState ? selectedState.name : formData.state,
        country: city && selectedCountry ? selectedCountry.name : formData.country,
      });
    };

    const toggleManualCity = () => {
      setUseManualCity(!useManualCity);
      setSelectedCity(null);
      setFormData({ ...formData, city: '' });
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setError('');
      setSuccess('');
      setLoading(true);

      try {
        const token = localStorage.getItem('token');
        const response = await axios.put(
          'http://localhost:5376/api/auth/profile',
          formData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        await updateUser();
        setSuccess(response.data.message);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to update profile');
      } finally {
        setLoading(false);
      }
    };

    const inputVariants = {
      hidden: { opacity: 0, x: -10 },
      visible: (i) => ({
        opacity: 1,
        x: 0,
        transition: { delay: i * 0.1, duration: 0.3 },
      }),
    };

    return (
      <motion.form
        onSubmit={handleSubmit}
        className="space-y-2 w-full max-w-sm mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <style>
          {`
            .custom-dropdown {
              position: relative;
              width: 100%;
            }
            .custom-dropdown .dropdown-menu {
              max-height: 200px;
              overflow-y: auto;
              background: white;
              border: 1px solid #e2e8f0;
              border-radius: 0.375rem;
              z-index: 1000;
              position: absolute;
              top: 100%;
              left: 0;
              right: 0;
              box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            }
            .custom-dropdown .dropdown-menu::-webkit-scrollbar {
              width: 8px;
            }
            .custom-dropdown .dropdown-menu::-webkit-scrollbar-thumb {
              background: #cbd5e0;
              border-radius: 4px;
            }
            .custom-dropdown .dropdown-menu::-webkit-scrollbar-track {
              background: #f7fafc;
            }
            .custom-dropdown .dropdown-menu > div,
            .custom-dropdown .dropdown-menu > ul,
            .custom-dropdown .dropdown-menu > div > ul {
              max-height: 200px;
              overflow-y: auto;
            }
          `}
        </style>
        <motion.div custom={0} variants={inputVariants}>
          <label className="block text-gray-600 text-xs font-medium mb-1">First Name</label>
          <div className="relative">
            <FaUser className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              className="w-full pl-8 pr-3 py-1.5 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs bg-gray-50"
              placeholder="First name"
              required
              aria-label="First Name"
            />
          </div>
        </motion.div>
        <motion.div custom={1} variants={inputVariants}>
          <label className="block text-gray-600 text-xs font-medium mb-1">Last Name</label>
          <div className="relative">
            <FaUser className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              className="w-full pl-8 pr-3 py-1.5 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs bg-gray-50"
              placeholder="Last name"
              aria-label="Last Name"
            />
          </div>
        </motion.div>
        <motion.div custom={2} variants={inputVariants}>
          <label className="block text-gray-600 text-xs font-medium mb-1">Email</label>
          <div className="relative">
            <FaEnvelope className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full pl-8 pr-3 py-1.5 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs bg-gray-50"
              placeholder="Email address"
              required
              aria-label="Email"
            />
          </div>
        </motion.div>
        <motion.div custom={3} variants={inputVariants}>
          <label className="block text-gray-600 text-xs font-medium mb-1">Phone</label>
          <div className="relative">
            <FaPhone className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full pl-8 pr-3 py-1.5 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs bg-gray-50"
              placeholder="Phone number"
              aria-label="Phone Number"
            />
          </div>
        </motion.div>
        <motion.div custom={4} variants={inputVariants}>
          <label className="block text-gray-600 text-xs font-medium mb-1">Country</label>
          <div className="relative custom-dropdown">
            <FaGlobe className="absolute left-2.5 top-3.5 transform -translate-y-1/2 text-gray-400 text-sm z-10" />
            <CountrySelect
              placeHolder="Select country"
              onChange={handleCountryChange}
              value={selectedCountry}
              className="w-full"
              showFlag={true}
              searchable="true"
              inputClassName="w-full pl-8 pr-3 py-1.5 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs bg-gray-50"
              aria-label="Country"
            />
          </div>
        </motion.div>
        <motion.div custom={5} variants={inputVariants}>
          <label className="block text-gray-600 text-xs font-medium mb-1">State</label>
          <div className="relative custom-dropdown">
            <FaFlag className="absolute left-2.5 top-3.5 transform -translate-y-1/2 text-gray-400 text-sm z-10" />
            <StateSelect
              placeHolder="Select state"
              countryid={selectedCountry?.id}
              onChange={handleStateChange}
              value={selectedState}
              className="w-full"
              disabled={!selectedCountry}
              searchable="true"
              inputClassName="w-full pl-8 pr-3 py-1.5 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs bg-gray-50"
              aria-label="State"
            />
          </div>
        </motion.div>
        <motion.div custom={6} variants={inputVariants}>
          <label className="block text-gray-600 text-xs font-medium mb-1">City</label>
          <div className="relative">
            {useManualCity ? (
              <>
                <FaCity className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Enter city"
                  className="w-full pl-8 pr-3 py-1.5 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs bg-gray-50"
                  aria-label="City"
                />
              </>
            ) : (
              <div className="relative custom-dropdown">
                <FaCity className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm z-10" />
                <CitySelect
                  placeHolder="Select city"
                  countryid={selectedCountry?.id}
                  stateid={selectedState?.id}
                  onChange={handleCityChange}
                  value={selectedCity}
                  className="w-full"
                  disabled={!selectedState}
                  searchable="true"
                  inputClassName="w-full pl-8 pr-3 py-1.5 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs bg-gray-50"
                  aria-label="City"
                />
              </div>
            )}
          </div>
          <label className="flex items-center gap-1.5 mt-1 text-[10px] text-gray-500">
            <input
              type="checkbox"
              checked={useManualCity}
              onChange={toggleManualCity}
              className="h-3.5 w-3.5 accent-blue-500"
              aria-label="Enter city manually"
            />
            Manual city
          </label>
        </motion.div>
        <motion.div custom={7} variants={inputVariants}>
          <label className="block text-gray-600 text-xs font-medium mb-1">Zip Code</label>
          <div className="relative">
            <FaMailBulk className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
            <input
              type="text"
              name="zip_code"
              value={formData.zip_code}
              onChange={handleChange}
              className="w-full pl-8 pr-3 py-1.5 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs bg-gray-50"
              placeholder="Zip code"
              aria-label="Zip Code"
            />
          </div>
        </motion.div>
        {error && (
          <motion.p
            className="text-red-500 text-xs"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            {error}
          </motion.p>
        )}
        {success && (
          <motion.p
            className="text-green-500 text-xs"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            {success}
          </motion.p>
        )}
        <motion.button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-md hover:shadow-md transition-shadow text-xs font-medium"
          whileHover={{ scale: 1.02, boxShadow: '0 2px 8px rgba(0, 0, 255, 0.2)' }}
          whileTap={{ scale: 0.98 }}
          disabled={loading}
          aria-label="Save Profile Changes"
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </motion.button>
      </motion.form>
    );
};

export default ProfileInfoForm;

















































// import React, { useState, useContext, useEffect } from 'react';
// import { motion } from 'framer-motion';
// import axios from 'axios';
// import { AuthContext } from '../context/AuthContext';
// import { CountrySelect, StateSelect, CitySelect } from 'react-country-state-city';
// import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCity, FaGlobe, FaFlag, FaMailBulk } from 'react-icons/fa';

// const ProfileInfoForm = ({ user }) => {
//     const { updateUser } = useContext(AuthContext);
//     const [formData, setFormData] = useState({
//       first_name: user.first_name || '',
//       last_name: user.last_name || '',
//       email: user.email || '',
//       phone: user.phone || '',
//       city: user.city || '',
//       zip_code: user.zip_code || '',
//       state: user.state || '',
//       country: user.country || '',
//     });
//     const [selectedCountry, setSelectedCountry] = useState(null);
//     const [selectedState, setSelectedState] = useState(null);
//     const [selectedCity, setSelectedCity] = useState(null);
//     const [useManualCity, setUseManualCity] = useState(!!formData.city);
//     const [error, setError] = useState('');
//     const [success, setSuccess] = useState('');
//     const [loading, setLoading] = useState(false);
  
//     // Initialize dropdowns with user's existing data
//     useEffect(() => {
//       if (formData.city && !selectedCity) {
//         setUseManualCity(true);
//       }
//     }, [formData.city, selectedCity]);
  
//     const handleChange = (e) => {
//       setFormData({ ...formData, [e.target.name]: e.target.value });
//     };
  
//     const handleCountryChange = (country) => {
//       setSelectedCountry(country);
//       setSelectedState(null);
//       setSelectedCity(null);
//       setFormData({
//         ...formData,
//         country: country ? country.name : '',
//         state: '',
//         city: '',
//       });
//     };
  
//     const handleStateChange = (state) => {
//       setSelectedState(state);
//       setSelectedCity(null);
//       setFormData({
//         ...formData,
//         state: state ? state.name : '',
//         city: '',
//       });
//     };
  
//     const handleCityChange = (city) => {
//       setSelectedCity(city);
//       setFormData({
//         ...formData,
//         city: city ? city.name : '',
//         state: city && selectedState ? selectedState.name : formData.state,
//         country: city && selectedCountry ? selectedCountry.name : formData.country,
//       });
//     };
  
//     const toggleManualCity = () => {
//       setUseManualCity(!useManualCity);
//       setSelectedCity(null);
//       setFormData({ ...formData, city: '' });
//     };
  
//     const handleSubmit = async (e) => {
//       e.preventDefault();
//       setError('');
//       setSuccess('');
//       setLoading(true);
  
//       try {
//         const token = localStorage.getItem('token');
//         const response = await axios.put(
//           'http://localhost:5376/api/auth/profile',
//           formData,
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );
  
//         await updateUser();
//         setSuccess(response.data.message);
//       } catch (err) {
//         setError(err.response?.data?.message || 'Failed to update profile');
//       } finally {
//         setLoading(false);
//       }
//     };
  
//     const inputVariants = {
//       hidden: { opacity: 0, x: -10 },
//       visible: (i) => ({
//         opacity: 1,
//         x: 0,
//         transition: { delay: i * 0.1, duration: 0.3 },
//       }),
//     };
  
//     return (
//       <motion.form
//         onSubmit={handleSubmit}
//         className="space-y-2 w-full max-w-sm mx-auto"
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ duration: 0.3 }}
//       >
//         <motion.div custom={0} variants={inputVariants}>
//           <label className="block text-gray-600 text-xs font-medium mb-1">First Name</label>
//           <div className="relative">
//             <FaUser className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
//             <input
//               type="text"
//               name="first_name"
//               value={formData.first_name}
//               onChange={handleChange}
//               className="w-full pl-8 pr-3 py-1.5 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs bg-gray-50"
//               placeholder="First name"
//               required
//               aria-label="First Name"
//             />
//           </div>
//         </motion.div>
//         <motion.div custom={1} variants={inputVariants}>
//           <label className="block text-gray-600 text-xs font-medium mb-1">Last Name</label>
//           <div className="relative">
//             <FaUser className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
//             <input
//               type="text"
//               name="last_name"
//               value={formData.last_name}
//               onChange={handleChange}
//               className="w-full pl-8 pr-3 py-1.5 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs bg-gray-50"
//               placeholder="Last name"
//               aria-label="Last Name"
//             />
//           </div>
//         </motion.div>
//         <motion.div custom={2} variants={inputVariants}>
//           <label className="block text-gray-600 text-xs font-medium mb-1">Email</label>
//           <div className="relative">
//             <FaEnvelope className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
//             <input
//               type="email"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               className="w-full pl-8 pr-3 py-1.5 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs bg-gray-50"
//               placeholder="Email address"
//               required
//               aria-label="Email"
//             />
//           </div>
//         </motion.div>
//         <motion.div custom={3} variants={inputVariants}>
//           <label className="block text-gray-600 text-xs font-medium mb-1">Phone</label>
//           <div className="relative">
//             <FaPhone className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
//             <input
//               type="tel"
//               name="phone"
//               value={formData.phone}
//               onChange={handleChange}
//               className="w-full pl-8 pr-3 py-1.5 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs bg-gray-50"
//               placeholder="Phone number"
//               aria-label="Phone Number"
//             />
//           </div>
//         </motion.div>
//         <motion.div custom={4} variants={inputVariants}>
//           <label className="block text-gray-600 text-xs font-medium mb-1">Country</label>
//           <div className="relative">
//             <FaGlobe className="absolute left-2.5 top-3.5 transform -translate-y-1/2 text-gray-400 text-sm z-10" />
//             <CountrySelect
//               placeHolder="Select country"
//               onChange={handleCountryChange}
//               value={selectedCountry}
//               className="w-full"
//               showFlag={true}
//               searchable={true}
//               inputClassName="w-full pl-8 pr-3 py-1.5 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs bg-gray-50"
//               aria-label="Country"
//             />
//           </div>
//         </motion.div>
//         <motion.div custom={5} variants={inputVariants}>
//           <label className="block text-gray-600 text-xs font-medium mb-1">State</label>
//           <div className="relative">
//             <FaFlag className="absolute left-2.5 top-3.5 transform -translate-y-1/2 text-gray-400 text-sm z-10" />
//             <StateSelect
//               placeHolder="Select state"
//               countryid={selectedCountry?.id}
//               onChange={handleStateChange}
//               value={selectedState}
//               className="w-full"
//               disabled={!selectedCountry}
//               searchable={true}
//               inputClassName="w-full pl-8 pr-3 py-1.5 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs bg-gray-50"
//               aria-label="State"
//             />
//           </div>
//         </motion.div>
//         <motion.div custom={6} variants={inputVariants}>
//           <label className="block text-gray-600 text-xs font-medium mb-1">City</label>
//           <div className="relative">
//             {useManualCity ? (
//               <>
//                 <FaCity className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
//                 <input
//                   type="text"
//                   name="city"
//                   value={formData.city}
//                   onChange={handleChange}
//                   placeholder="Enter city"
//                   className="w-full pl-8 pr-3 py-1.5 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs bg-gray-50"
//                   aria-label="City"
//                 />
//               </>
//             ) : (
//               <>
//                 <FaCity className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
//                 <CitySelect
//                   placeHolder="Select city"
//                   countryid={selectedCountry?.id}
//                   stateid={selectedState?.id}
//                   onChange={handleCityChange}
//                   value={selectedCity}
//                   className="w-full"
//                   disabled={!selectedState}
//                   searchable={true}
//                   inputClassName="w-full pl-8 pr-3 py-1.5 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs bg-gray-50"
//                   aria-label="City"
//                 />
//               </>
//             )}
//           </div>
//           <label className="flex items-center gap-1.5 mt-1 text-[10px] text-gray-500">
//             <input
//               type="checkbox"
//               checked={useManualCity}
//               onChange={toggleManualCity}
//               className="h-3.5 w-3.5 accent-blue-500"
//               aria-label="Enter city manually"
//             />
//             Manual city
//           </label>
//         </motion.div>
//         <motion.div custom={7} variants={inputVariants}>
//           <label className="block text-gray-600 text-xs font-medium mb-1">Zip Code</label>
//           <div className="relative">
//             <FaMailBulk className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
//             <input
//               type="text"
//               name="zip_code"
//               value={formData.zip_code}
//               onChange={handleChange}
//               className="w-full pl-8 pr-3 py-1.5 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs bg-gray-50"
//               placeholder="Zip code"
//               aria-label="Zip Code"
//             />
//           </div>
//         </motion.div>
//         {error && (
//           <motion.p
//             className="text-red-500 text-xs"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ duration: 0.2 }}
//           >
//             {error}
//           </motion.p>
//         )}
//         {success && (
//           <motion.p
//             className="text-green-500 text-xs"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ duration: 0.2 }}
//           >
//             {success}
//           </motion.p>
//         )}
//         <motion.button
//           type="submit"
//           className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-md hover:shadow-md transition-shadow text-xs font-medium"
//           whileHover={{ scale: 1.02, boxShadow: '0 2px 8px rgba(0, 0, 255, 0.2)' }}
//           whileTap={{ scale: 0.98 }}
//           disabled={loading}
//           aria-label="Save Profile Changes"
//         >
//           {loading ? 'Saving...' : 'Save Changes'}
//         </motion.button>
//       </motion.form>
//     );
//   };
  
//   export default ProfileInfoForm;







// const ProfileInfoForm = ({ user }) => {
//   const { updateUser } = useContext(AuthContext);
//   const [formData, setFormData] = useState({
//     first_name: user.first_name || '',
//     last_name: user.last_name || '',
//     email: user.email || '',
//     phone: user.phone || '',
//     address: user.address || '',
//     city: user.city || '',
//     zip_code: user.zip_code || '',
//     state: user.state || '',
//     country: user.country || '',
//   });
//   const [selectedCountry, setSelectedCountry] = useState(null);
//   const [selectedState, setSelectedState] = useState(null);
//   const [selectedCity, setSelectedCity] = useState(null);
//   const [useManualCity, setUseManualCity] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [loading, setLoading] = useState(false);

//   // Initialize dropdowns with user's existing data
//   useEffect(() => {
//     // Note: react-country-state-city requires country/state/city IDs for pre-selection
//     // Since we store names in the database, we'll rely on manual entry or user re-selection
//     // If you want to pre-select based on names, you'd need to map names to IDs (requires additional data)
//     if (formData.country && !selectedCountry) {
//       setUseManualCity(true); // Default to manual if city exists (since we don't have IDs)
//     }
//   }, [formData, selectedCountry]);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleCountryChange = (country) => {
//     setSelectedCountry(country);
//     setSelectedState(null);
//     setSelectedCity(null);
//     setFormData({
//       ...formData,
//       country: country ? country.name : '',
//       state: '',
//       city: '',
//     });
//   };

//   const handleStateChange = (state) => {
//     setSelectedState(state);
//     setSelectedCity(null);
//     setFormData({
//       ...formData,
//       state: state ? state.name : '',
//       city: '',
//     });
//   };

//   const handleCityChange = (city) => {
//     setSelectedCity(city);
//     setFormData({
//       ...formData,
//       city: city ? city.name : '',
//       state: city && selectedState ? selectedState.name : formData.state,
//       country: city && selectedCountry ? selectedCountry.name : formData.country,
//     });
//   };

//   const toggleManualCity = () => {
//     setUseManualCity(!useManualCity);
//     setSelectedCity(null);
//     setFormData({ ...formData, city: '' });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setSuccess('');
//     setLoading(true);

//     try {
//       const token = localStorage.getItem('token');
//       const response = await axios.put(
//         'http://localhost:5376/api/auth/profile',
//         formData,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       await updateUser();
//       setSuccess(response.data.message);
//     } catch (err) {
//       setError(err.response?.data?.message || 'Failed to update profile');
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
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <div>
//           <label className="block text-gray-700">First Name</label>
//           <input
//             type="text"
//             name="first_name"
//             value={formData.first_name}
//             onChange={handleChange}
//             className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//             required
//           />
//         </div>
//         <div>
//           <label className="block text-gray-700">Last Name</label>
//           <input
//             type="text"
//             name="last_name"
//             value={formData.last_name}
//             onChange={handleChange}
//             className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//         </div>
//       </div>
//       <div>
//         <label className="block text-gray-700">Email</label>
//         <input
//           type="email"
//           name="email"
//           value={formData.email}
//           onChange={handleChange}
//           className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//           required
//         />
//       </div>
//       <div>
//         <label className="block text-gray-700">Phone</label>
//         <input
//           type="tel"
//           name="phone"
//           value={formData.phone}
//           onChange={handleChange}
//           className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//         />
//       </div>
//       <div>
//         <label className="block text-gray-700">Address</label>
//         <textarea
//           name="address"
//           value={formData.address}
//           onChange={handleChange}
//           className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//         ></textarea>
//       </div>
//       <div>
//         <label className="block text-gray-700">Country</label>
//         <CountrySelect
//           placeHolder="Select Country"
//           onChange={handleCountryChange}
//           value={selectedCountry}
//           className="w-full"
//           showFlag={true}
//           searchable={true}
//         />
//       </div>
//       <div>
//         <label className="block text-gray-700">State</label>
//         <StateSelect
//           placeHolder="Select State"
//           countryid={selectedCountry?.id}
//           onChange={handleStateChange}
//           value={selectedState}
//           className="w-full"
//           disabled={!selectedCountry}
//           searchable={true}
//         />
//       </div>
//       <div>
//         <label className="block text-gray-700">City</label>
//         {useManualCity ? (
//           <input
//             type="text"
//             name="city"
//             value={formData.city}
//             onChange={handleChange}
//             placeholder="Enter city manually"
//             className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//         ) : (
//           <CitySelect
//             placeHolder="Select City"
//             countryid={selectedCountry?.id}
//             stateid={selectedState?.id}
//             onChange={handleCityChange}
//             value={selectedCity}
//             className="w-full"
//             disabled={!selectedState}
//             searchable={true}
//           />
//         )}
//         <label className="flex items-center gap-2 mt-2">
//           <input
//             type="checkbox"
//             checked={useManualCity}
//             onChange={toggleManualCity}
//             className="h-4 w-4"
//           />
//           <span className="text-sm text-gray-600">Enter city manually</span>
//         </label>
//       </div>
//       <div>
//         <label className="block text-gray-700">Zip Code</label>
//         <input
//           type="text"
//           name="zip_code"
//           value={formData.zip_code}
//           onChange={handleChange}
//           className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
//         {loading ? 'Saving...' : 'Save Changes'}
//       </motion.button>
//     </motion.form>
//   );
// };

// export default ProfileInfoForm;

// const ProfileInfoForm = ({ user }) => {
//   const { updateUser } = useContext(AuthContext);
//   const [formData, setFormData] = useState({
//     first_name: user.first_name || '',
//     last_name: user.last_name || '',
//     email: user.email || '',
//     phone: user.phone || '',
//     address: user.address || '',
//     city: user.city || '',
//     zip_code: user.zip_code || '',
//     state: user.state || '',
//     country: user.country || '',
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

//     try {
//       const token = localStorage.getItem('token');
//       const response = await axios.put(
//         'http://localhost:5376/api/auth/profile',
//         formData,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       // Fetch updated user data
//       const userResponse = await axios.get('http://localhost:5376/api/auth/me', {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       updateUser(userResponse.data.user);
//       setSuccess(response.data.message);
//     } catch (err) {
//       setError(err.response?.data?.message || 'Failed to update profile');
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
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <div>
//           <label className="block text-gray-700">First Name</label>
//           <input
//             type="text"
//             name="first_name"
//             value={formData.first_name}
//             onChange={handleChange}
//             className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//             required
//           />
//         </div>
//         <div>
//           <label className="block text-gray-700">Last Name</label>
//           <input
//             type="text"
//             name="last_name"
//             value={formData.last_name}
//             onChange={handleChange}
//             className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//         </div>
//       </div>
//       <div>
//         <label className="block text-gray-700">Email</label>
//         <input
//           type="email"
//           name="email"
//           value={formData.email}
//           onChange={handleChange}
//           className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//           required
//         />
//       </div>
//       <div>
//         <label className="block text-gray-700">Phone</label>
//         <input
//           type="tel"
//           name="phone"
//           value={formData.phone}
//           onChange={handleChange}
//           className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//         />
//       </div>
//       <div>
//         <label className="block text-gray-700">Address</label>
//         <textarea
//           name="address"
//           value={formData.address}
//           onChange={handleChange}
//           className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//         ></textarea>
//       </div>
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <div>
//           <label className="block text-gray-700">City</label>
//           <input
//             type="text"
//             name="city"
//             value={formData.city}
//             onChange={handleChange}
//             className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//         </div>
//         <div>
//           <label className="block text-gray-700">Zip Code</label>
//           <input
//             type="text"
//             name="zip_code"
//             value={formData.zip_code}
//             onChange={handleChange}
//             className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//         </div>
//       </div>
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <div>
//           <label className="block text-gray-700">State</label>
//           <input
//             type="text"
//             name="state"
//             value={formData.state}
//             onChange={handleChange}
//             className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//         </div>
//         <div>
//           <label className="block text-gray-700">Country</label>
//           <input
//             type="text"
//             name="country"
//             value={formData.country}
//             onChange={handleChange}
//             className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//         </div>
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
//         {loading ? 'Saving...' : 'Save Changes'}
//       </motion.button>
//     </motion.form>
//   );
// };

// export default ProfileInfoForm;