import React, { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { FiPackage } from 'react-icons/fi';

const OrdersPage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('https://ecomm-backend-blue.vercel.app/api/orders', {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Process orders to ensure total_amount is a number
        const processedOrders = response.data.orders.map((order) => ({
          ...order,
          total_amount: parseFloat(order.total_amount) || 0, // Fallback to 0 if invalid
        }));
        setOrders(processedOrders || []);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Failed to load orders. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md text-center">
          <strong>Error:</strong> {error}
          <div className="mt-2">
            <Link to="/" className="text-indigo-600 hover:underline">Return to Home</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Your Orders</h1>

        {orders.length === 0 ? (
          <div className="text-center">
            <FiPackage className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-gray-500">You haven't placed any orders yet.</p>
            <Link
              to="/"
              className="mt-4 inline-block bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.order_id} className="bg-white shadow-md rounded-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h2 className="text-lg font-semibold">Order #{order.order_id.slice(0, 8)}</h2>
                    <p className="text-sm text-gray-500">
                      Placed on {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      order.order_status === 'Delivered'
                        ? 'bg-green-100 text-green-700'
                        : order.order_status === 'Cancelled'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {order.order_status}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-700">Shipping Address</h3>
                    <p className="text-gray-600">
                      {order.address_line}, {order.city}, {order.state}, {order.country} -{' '}
                      {order.zip_code}
                    </p>
                    <p className="text-gray-600">Phone: {order.phone}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-700">Payment Details</h3>
                    <p className="text-gray-600">Method: {order.payment_method}</p>
                    <p className="text-gray-600">Status: {order.payment_status}</p>
                    <p className="text-gray-600">Total: ₹{order.total_amount.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;