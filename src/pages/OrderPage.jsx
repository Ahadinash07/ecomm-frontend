import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FiMapPin, FiEdit, FiTrash2 } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import AddressModal from '../Modal/AddressModal';
import axios from 'axios';

const API_URL = 'http://localhost:5376';


const OrderPage = () => {
  const { user, cartItems, addresses, createOrder, verifyPayment, addAddress, updateAddress } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('Razorpay');
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (cartItems.length === 0) {
      setError('Your cart is empty');
      navigate('/cart');
    } else {
      // Set default address if available
      const defaultAddress = addresses.find((addr) => addr.is_default);
      setSelectedAddress(defaultAddress || addresses[0] || null);
    }
    setLoading(false);
  }, [user, cartItems, addresses, navigate]);

  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
  };

  const handleAddAddress = () => {
    setEditingAddress(null);
    setIsAddressModalOpen(true);
  };

  const handleEditAddress = (address) => {
    setEditingAddress(address);
    setIsAddressModalOpen(true);
  };

  const handleDeleteAddress = async (address_id) => {
    try {
      const { deleteAddress } = useContext(AuthContext);
      const result = await deleteAddress(address_id);
      if (result.success) {
        setMessage({ type: 'success', text: result.message });
        if (selectedAddress?.address_id === address_id) {
          setSelectedAddress(addresses.find((addr) => addr.address_id !== address_id) || null);
        }
      } else {
        setMessage({ type: 'error', text: result.message });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to delete address' });
    } finally {
      setTimeout(() => setMessage(null), 3000);
    }
  };



  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      setMessage({ type: 'error', text: 'Please select or add an address' });
      setTimeout(() => setMessage(null), 3000);
      return;
    }
  
    try {
      const orderData = {
        address_id: selectedAddress.address_id,
        payment_method: paymentMethod,
      };
      
      console.log('Attempting to place order with data:', orderData);
      
      const result = await createOrder(orderData);
  
      if (!result.success) {
        console.error('Order creation failed:', result);
        setMessage({ 
          type: 'error', 
          text: result.message || 'Failed to place order',
          details: result.error 
        });
        setTimeout(() => setMessage(null), 5000);
        return;
      }
  
      if (paymentMethod === 'COD') {
        setMessage({ 
          type: 'success', 
          text: 'Order placed successfully!' 
        });
        setTimeout(() => navigate('/orders'), 2000);
        return;
      }
  
      // Razorpay payment handling
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: result.order.amount * 100,
        currency: result.order.currency,
        name: 'E-Shop',
        description: 'Order Payment',
        order_id: result.order.razorpay_order_id,
        handler: async (response) => {
          try {
            console.log('Razorpay payment response:', response);
            const verifyResult = await verifyPayment({
              order_id: result.order.order_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            
            if (verifyResult.success) {
              setMessage({ 
                type: 'success', 
                text: 'Payment successful! Order placed.' 
              });
              setTimeout(() => navigate('/orders'), 2000);
            } else {
              setMessage({ 
                type: 'error', 
                text: verifyResult.message 
              });
            }
          } catch (err) {
            console.error('Payment verification error:', err);
            setMessage({ 
              type: 'error', 
              text: 'Failed to verify payment' 
            });
          }
        },
        prefill: {
          name: user.first_name,
          email: user.email,
          contact: user.phone,
        },
        theme: {
          color: '#4F46E5',
        },
      };
  
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error('Order placement error:', err);
      setMessage({ 
        type: 'error', 
        text: err.response?.data?.message || 'Failed to place order. Please try again.',
        details: err.response?.data
      });
      setTimeout(() => setMessage(null), 5000);
    }
  };




//   const handlePlaceOrder = async () => {
//     if (!selectedAddress) {
//       setMessage({ type: 'error', text: 'Please select or add an address' });
//       setTimeout(() => setMessage(null), 3000);
//       return;
//     }

//     try {
//       const orderData = {
//         address_id: selectedAddress.address_id,
//         payment_method: paymentMethod,
//       };
      
//       console.log('Sending order data:', orderData); // Debug log
      
//       const result = await createOrder(orderData);

//       if (!result.success) {
//         setMessage({ type: 'error', text: result.message });
//         setTimeout(() => setMessage(null), 3000);
//         return;
//       }

//       if (paymentMethod === 'COD') {
//         setMessage({ type: 'success', text: 'Order placed successfully!' });
//         setTimeout(() => navigate('/orders'), 2000);
//         return;
//       }

//       // Razorpay payment
//       const options = {
//         key: process.env.REACT_APP_RAZORPAY_KEY_ID,
//         amount: result.order.amount * 100,
//         currency: result.order.currency,
//         name: 'E-Shop',
//         description: 'Order Payment',
//         order_id: result.order.razorpay_order_id,
//         handler: async (response) => {
//           try {
//             const verifyResult = await verifyPayment({
//               order_id: result.order.order_id,
//               razorpay_order_id: response.razorpay_order_id,
//               razorpay_payment_id: response.razorpay_payment_id,
//               razorpay_signature: response.razorpay_signature,
//             });
//             if (verifyResult.success) {
//               setMessage({ type: 'success', text: 'Payment successful! Order placed.' });
//               setTimeout(() => navigate('/orders'), 2000);
//             } else {
//               setMessage({ type: 'error', text: verifyResult.message });
//             }
//           } catch (err) {
//             setMessage({ type: 'error', text: 'Failed to verify payment' });
//           }
//         },
//         prefill: {
//           name: user.first_name,
//           email: user.email,
//           contact: user.phone,
//         },
//         theme: {
//           color: '#4F46E5',
//         },
//       };

//       const rzp = new window.Razorpay(options);
//       rzp.open();
//     } catch (err) {
//       console.error('Order placement error:', err);
//       setMessage({ 
//         type: 'error', 
//         text: err.response?.data?.message || 'Failed to place order. Please try again.' 
//       });
//       setTimeout(() => setMessage(null), 3000);
//     }
//   };

  const calculateTotal = () => {
    return cartItems
      .reduce((total, item) => total + (parseFloat(item.price) || 0) * item.quantity, 0)
      .toFixed(2);
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md text-center">
        <strong>Error:</strong> {error}
        <div className="mt-2">
          <Link to="/" className="text-indigo-600 hover:underline">Return to Home</Link>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Place Your Order</h1>

        {message && (
          <div className={`mb-4 p-4 rounded-md ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message.text}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              {cartItems.map((item) => (
                <div key={item.cartId} className="flex items-center border-b py-4">
                  <img
                    src={item.images[0] || 'https://via.placeholder.com/100'}
                    alt={item.productName}
                    className="w-16 h-16 object-contain rounded-md mr-4"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900">{item.productName}</h3>
                    <p className="text-gray-500">₹{parseFloat(item.price).toFixed(2)} x {item.quantity}</p>
                  </div>
                  <p className="text-gray-900 font-medium">₹{(parseFloat(item.price) * item.quantity).toFixed(2)}</p>
                </div>
              ))}
              <div className="flex justify-end mt-4">
                <p className="text-lg font-medium text-gray-900">Total: ₹{calculateTotal()}</p>
              </div>
            </div>

            {/* Address Selection */}
            <div className="bg-white shadow-md rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Delivery Address</h2>
                <button
                  onClick={handleAddAddress}
                  className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                >
                  Add New Address
                </button>
              </div>
              {addresses.length === 0 ? (
                <p className="text-gray-500">No addresses available. Please add an address.</p>
              ) : (
                <div className="space-y-4">
                  {addresses.map((address) => (
                    <div
                      key={address.address_id}
                      className={`border rounded-lg p-4 cursor-pointer flex justify-between items-center ${
                        selectedAddress?.address_id === address.address_id ? 'border-indigo-500 bg-indigo-50' : ''
                      }`}
                      onClick={() => handleAddressSelect(address)}
                    >
                      <div>
                        <p className="font-medium text-gray-900">
                          {address.address_line}, {address.city}, {address.state}, {address.country} - {address.zip_code}
                        </p>
                        <p className="text-gray-600">Phone: {address.phone}</p>
                        {address.is_default && (
                          <span className="text-green-600 text-sm">Default</span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditAddress(address);
                          }}
                          className="text-indigo-600 hover:text-indigo-800"
                        >
                          <FiEdit />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteAddress(address.address_id);
                          }}
                          className="text-red-600 hover:text-red-800"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
            <div className="space-y-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="Razorpay"
                  checked={paymentMethod === 'Razorpay'}
                  onChange={() => setPaymentMethod('Razorpay')}
                  className="mr-2"
                />
                <span className="text-gray-700">Pay with Razorpay</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="COD"
                  checked={paymentMethod === 'COD'}
                  onChange={() => setPaymentMethod('COD')}
                  className="mr-2"
                />
                <span className="text-gray-700">Cash on Delivery</span>
              </label>
            </div>
            <button
              onClick={handlePlaceOrder}
              className="mt-6 w-full bg-indigo-600 text-white py-3 px-6 rounded-md hover:bg-indigo-700"
              disabled={!selectedAddress}
            >
              Place Order
            </button>
          </div>
        </div>
      </div>

      <AddressModal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        onSave={() => {
          setIsAddressModalOpen(false);
          // Refresh addresses after save
          const token = localStorage.getItem('token');
          axios.get(`${API_URL}/api/addresses`, {
            headers: { Authorization: `Bearer ${token}` },
          }).then(response => {
            setAddresses(response.data.addresses || []);
          });
        }}
        initialAddress={editingAddress}
        addAddress={addAddress}
        updateAddress={updateAddress}
      />
    </div>
  );
};

export default OrderPage;