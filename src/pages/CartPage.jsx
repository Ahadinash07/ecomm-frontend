import React, { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { FiTrash2 } from 'react-icons/fi';

const CartPage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const API_URL = 'http://localhost:5376';

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchCartItems = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/api/cart`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCartItems(response.data.items);
      } catch (err) {
        console.error('Error fetching cart items:', err);
        setError(err.response?.data?.message || 'Failed to load cart');
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, [user, navigate]);

  const handleQuantityChange = async (cartId, newQuantity) => {
    try {
      const token = localStorage.getItem('token');
      const currentItem = cartItems.find(item => item.cartId === cartId);
      
      // Maximum allowed quantity is 6 or available quantity, whichever is lower
      const maxQuantity = Math.min(currentItem.quantityAvailable || 6, 6);

      if (newQuantity <= 0 && currentItem.quantity === 1) {
        // If trying to reduce quantity below 1, remove the item
        await axios.delete(`${API_URL}/api/cart/remove`, {
          headers: { Authorization: `Bearer ${token}` },
          data: { cartId },
        });
        setCartItems(prevItems => prevItems.filter(item => item.cartId !== cartId));
      } else if (newQuantity >= 1 && newQuantity <= maxQuantity) {
        // Update quantity if it's between 1 and maxQuantity
        await axios.put(
          `${API_URL}/api/cart/update`,
          { cartId, quantity: newQuantity },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setCartItems(prevItems =>
          prevItems.map(item =>
            item.cartId === cartId ? { ...item, quantity: newQuantity } : item
          )
        );
      } else if (newQuantity > maxQuantity) {
        // Show message if trying to add more than allowed
        setMessage({
          type: 'warning',
          text: `You cannot add more than ${maxQuantity} items of ${currentItem.productName} to your cart.`,
        });
        setTimeout(() => setMessage(null), 3000);
      }
    } catch (err) {
      console.error('Error updating cart item:', err);
      setMessage({
        type: 'error',
        text: err.response?.data?.message || 'Failed to update cart item',
      });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleRemoveItem = async (cartId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/api/cart/remove`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { cartId },
      });
      setCartItems(prevItems => prevItems.filter(item => item.cartId !== cartId));
      setMessage({
        type: 'success',
        text: 'Item removed from cart successfully!',
      });
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      console.error('Error removing cart item:', err);
      setMessage({
        type: 'error',
        text: err.response?.data?.message || 'Failed to remove cart item',
      });
      setTimeout(() => setMessage(null), 3000);
    }
  };

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
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Your Cart</h1>

        {message && (
          <div className={`mb-4 p-4 rounded-md ${message.type === 'success' ? 'bg-green-100 text-green-700' : message.type === 'warning' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
            {message.text}
          </div>
        )}

        {cartItems.length === 0 ? (
          <div className="text-center">
            <p className="text-gray-500 mb-4">Your cart is empty.</p>
            <Link to="/" className="inline-block bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {cartItems.map(item => (
              <div key={item.cartId} className="flex items-center border-b pb-4">
                <img
                  onClick={() => navigate('/product/' + item.productId)}
                  src={item.images[0] || 'https://via.placeholder.com/100'}
                  alt={item.productName}
                  className="w-24 h-24 object-contain rounded-md mr-4"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900">{item.productName}</h3>
                  <p className="text-gray-500">₹{(parseFloat(item.price) || 0).toFixed(2)}</p>
                  <div className="flex items-center mt-2">
                    <button
                      onClick={() => handleQuantityChange(item.cartId, item.quantity - 1)}
                      className="px-2 py-1 text-gray-600 hover:bg-gray-100 rounded"
                    >
                      -
                    </button>
                    <span className="px-4">{item.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(item.cartId, item.quantity + 1)}
                      className="px-2 py-1 text-gray-600 hover:bg-gray-100 rounded"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <p className="text-gray-900 font-medium">₹{((parseFloat(item.price) || 0) * item.quantity).toFixed(2)}</p>
                  <button
                    onClick={() => handleRemoveItem(item.cartId)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <FiTrash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
            <div className="flex justify-end">
              <div className="text-right">
                <p className="text-lg font-medium text-gray-900">Total: ₹{calculateTotal()}</p>
                <button
                  className="mt-4 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
                  onClick={() => navigate('/checkout')}
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;