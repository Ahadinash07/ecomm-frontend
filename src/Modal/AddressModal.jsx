import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';

const AddressModal = ({ isOpen, onClose, onSave, initialAddress = null }) => {
  const { addAddress, updateAddress } = useContext(AuthContext);
  const [address, setAddress] = useState({
    address_line: '',
    city: '',
    state: '',
    country: '',
    zip_code: '',
    phone: '',
    is_default: false,
    address_id: null,
  });
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (initialAddress) {
      setAddress(initialAddress);
    } else {
      setAddress({
        address_line: '',
        city: '',
        state: '',
        country: '',
        zip_code: '',
        phone: '',
        is_default: false,
        address_id: null,
      });
    }
    setError(null);
    setFormErrors({});
  }, [initialAddress, isOpen]);

  const validateForm = () => {
    const errors = {};
    if (!address.address_line.trim()) errors.address_line = 'Address line is required';
    if (!address.city.trim()) errors.city = 'City is required';
    else if (address.city.length > 50) errors.city = 'City must be 50 characters or less';
    if (!address.state.trim()) errors.state = 'State is required';
    else if (address.state.length > 50) errors.state = 'State must be 50 characters or less';
    if (!address.country.trim()) errors.country = 'Country is required';
    else if (address.country.length > 50) errors.country = 'Country must be 50 characters or less';
    if (!address.zip_code.trim()) errors.zip_code = 'Zip code is required';
    else if (address.zip_code.length > 20) errors.zip_code = 'Zip code must be 20 characters or less';
    if (!address.phone.trim()) errors.phone = 'Phone number is required';
    else if (address.phone.length > 20) errors.phone = 'Phone number must be 20 characters or less';
    else if (!/^\d{10}$/.test(address.phone.replace(/\D/g, ''))) errors.phone = 'Phone number must be 10 digits';
    return errors;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAddress((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setFormErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      console.log('Submitting address:', address);
      const result = initialAddress
        ? await updateAddress({ ...address, address_id: initialAddress.address_id })
        : await addAddress(address);
      console.log('Address submission result:', result);
      if (result.success) {
        onSave();
        onClose();
      } else {
        setError(result.message || 'Failed to save address');
      }
    } catch (err) {
      console.error('Error saving address:', err);
      setError(err.response?.data?.message || 'Failed to save address');
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white p-6 rounded-lg max-w-md w-full"
        initial={{ scale: 0.8, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 50 }}
      >
        <h2 className="text-xl font-bold mb-4">{initialAddress ? 'Edit Address' : 'Add New Address'}</h2>
        {error && (
          <div className="bg-red-100 text-red-700 p-2 rounded mb-4">{error}</div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Address Line</label>
            <input
              type="text"
              name="address_line"
              value={address.address_line}
              onChange={handleChange}
              className={`mt-1 block w-full border rounded-md p-2 ${formErrors.address_line ? 'border-red-500' : ''}`}
            />
            {formErrors.address_line && (
              <p className="text-red-500 text-sm mt-1">{formErrors.address_line}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">City</label>
            <input
              type="text"
              name="city"
              value={address.city}
              onChange={handleChange}
              className={`mt-1 block w-full border rounded-md p-2 ${formErrors.city ? 'border-red-500' : ''}`}
              maxLength={50}
            />
            {formErrors.city && (
              <p className="text-red-500 text-sm mt-1">{formErrors.city}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">State</label>
            <input
              type="text"
              name="state"
              value={address.state}
              onChange={handleChange}
              className={`mt-1 block w-full border rounded-md p-2 ${formErrors.state ? 'border-red-500' : ''}`}
              maxLength={50}
            />
            {formErrors.state && (
              <p className="text-red-500 text-sm mt-1">{formErrors.state}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Country</label>
            <input
              type="text"
              name="country"
              value={address.country}
              onChange={handleChange}
              className={`mt-1 block w-full border rounded-md p-2 ${formErrors.country ? 'border-red-500' : ''}`}
              maxLength={50}
            />
            {formErrors.country && (
              <p className="text-red-500 text-sm mt-1">{formErrors.country}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Zip Code</label>
            <input
              type="text"
              name="zip_code"
              value={address.zip_code}
              onChange={handleChange}
              className={`mt-1 block w-full border rounded-md p-2 ${formErrors.zip_code ? 'border-red-500' : ''}`}
              maxLength={20}
            />
            {formErrors.zip_code && (
              <p className="text-red-500 text-sm mt-1">{formErrors.zip_code}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input
              type="text"
              name="phone"
              value={address.phone}
              onChange={handleChange}
              className={`mt-1 block w-full border rounded-md p-2 ${formErrors.phone ? 'border-red-500' : ''}`}
              maxLength={20}
            />
            {formErrors.phone && (
              <p className="text-red-500 text-sm mt-1">{formErrors.phone}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="is_default"
                checked={address.is_default}
                onChange={handleChange}
                className="mr-2"
              />
              <span className="text-sm font-medium text-gray-700">Set as Default</span>
            </label>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
            >
              Save
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default AddressModal;