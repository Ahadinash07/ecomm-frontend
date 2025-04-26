import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [addresses, setAddresses] = useState([]);
  const navigate = useNavigate();
  const API_URL = 'http://localhost:5376';

  // Fetch user and cart on app load
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios
        .get(`${API_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setUser(response.data.user);
        })
        .catch(async (error) => {
          console.error('Error fetching user:', error);
          if (error.response?.status === 401) {
            const newToken = await refreshToken();
            if (newToken) {
              axios
                .get(`${API_URL}/api/auth/me`, {
                  headers: { Authorization: `Bearer ${newToken}` },
                })
                .then((response) => {
                  setUser(response.data.user);
                })
                .catch(() => {
                  localStorage.removeItem('token');
                  localStorage.removeItem('refreshToken');
                  navigate('/login');
                });
            } else {
              localStorage.removeItem('token');
              localStorage.removeItem('refreshToken');
              navigate('/login');
            }
          }
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [navigate]);

  // Fetch cart items and addresses when user changes
  useEffect(() => {
    const fetchCartItems = async () => {
      if (user) {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get(`${API_URL}/api/cart`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const items = response.data.items || [];
          setCartItems(items);
          setCartCount(items.reduce((sum, item) => sum + item.quantity, 0));
        } catch (err) {
          console.error('Error fetching cart items:', err);
          setCartItems([]);
          setCartCount(0);
        }
      } else {
        setCartItems([]);
        setCartCount(0);
      }
    };

    const fetchAddresses = async () => {
      if (user) {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get(`${API_URL}/api/addresses`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setAddresses(response.data.addresses || []);
        } catch (err) {
          console.error('Error fetching addresses:', err);
          setAddresses([]);
        }
      } else {
        setAddresses([]);
      }
    };

    fetchCartItems();
    fetchAddresses();
  }, [user]);

  // Refresh token
  const refreshToken = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }
      const response = await axios.post(`${API_URL}/api/auth/refresh-token`, {
        refreshToken,
      });
      const { token } = response.data;
      localStorage.setItem('token', token);
      return token;
    } catch (error) {
      console.error('Refresh token error:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      navigate('/login');
      return null;
    }
  };

  // Login with email/phone and password
  const login = async (emailOrPhone, password) => {
    try {
      console.log('Sending login request:', { emailOrPhone });
      const response = await axios.post(`${API_URL}/api/auth/login`, {
        emailOrPhone,
        password,
      });
      const { token, refreshToken, message } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);
      const userResponse = await axios.get(`${API_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(userResponse.data.user);
      return { success: true, message };
    } catch (error) {
      console.error('Login error:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        navigate('/login');
        return { success: false, message: 'Session expired. Please log in again.' };
      }
      return { success: false, message: error.response?.data?.message || 'Login failed' };
    }
  };

  // Login with OTP
  const loginWithOtp = async (emailOrPhone, otp) => {
    try {
      console.log('Sending login-otp request:', { emailOrPhone, otp });
      const response = await axios.post(`${API_URL}/api/auth/login-otp`, {
        emailOrPhone,
        otp,
      });
      const { token, refreshToken, message } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);
      const userResponse = await axios.get(`${API_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(userResponse.data.user);
      return { success: true, message };
    } catch (error) {
      console.error('Login OTP error:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        navigate('/login');
        return { success: false, message: 'Session expired. Please log in again.' };
      }
      return { success: false, message: error.response?.data?.message || 'OTP login failed' };
    }
  };

  // Send OTP for login
  const sendOtp = async (emailOrPhone) => {
    try {
      console.log('Sending OTP request:', { emailOrPhone });
      const response = await axios.post(`${API_URL}/api/auth/send-otp`, {
        emailOrPhone,
      });
      return { success: true, message: response.data.message };
    } catch (error) {
      console.error('Send OTP error:', error);
      return { success: false, message: error.response?.data?.message || 'Failed to send OTP' };
    }
  };

  // Register with OTP
  const register = async (userData) => {
    try {
      console.log('Sending register request:', userData);
      const response = await axios.post(`${API_URL}/api/auth/register-otp`, userData);
      return { success: true, message: response.data.message };
    } catch (error) {
      console.error('Register error:', error);
      return { success: false, message: error.response?.data?.message || 'Registration failed' };
    }
  };

  // Verify OTP for registration
  const verifyOtp = async (email, otp) => {
    try {
      console.log('Sending verify OTP request:', { email, otp });
      const response = await axios.post(`${API_URL}/api/auth/verify-otp`, {
        email,
        otp,
      });
      const { token, refreshToken, message } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);
      const userResponse = await axios.get(`${API_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(userResponse.data.user);
      return { success: true, message };
    } catch (error) {
      console.error('Verify OTP error:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        navigate('/login');
        return { success: false, message: 'Session expired. Please log in again.' };
      }
      return { success: false, message: error.response?.data?.message || 'OTPPurchased verification failed' };
    }
  };

  // Logout
  const logout = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${API_URL}/api/auth/logout`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      setUser(null);
      setCartItems([]);
      setCartCount(0);
      setAddresses([]);
      navigate('/');
    }
  };

  // Update user data in context
  const updateUser = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token available');
      }
      const userResponse = await axios.get(`${API_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(userResponse.data.user);
      return { success: true, message: 'User data updated' };
    } catch (error) {
      console.error('Update user error:', error);
      if (error.response?.status === 401) {
        const newToken = await refreshToken();
        if (newToken) {
          const userResponse = await axios.get(`${API_URL}/api/auth/me`, {
            headers: { Authorization: `Bearer ${newToken}` },
          });
          setUser(userResponse.data.user);
          return { success: true, message: 'User data updated' };
        } else {
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          navigate('/login');
          return { success: false, message: 'Session expired. Please log in again.' };
        }
      }
      return { success: false, message: error.response?.data?.message || 'Failed to update user data' };
    }
  };

  // Send OTP for forgot password
  const sendForgotPasswordOtp = async (emailOrPhone) => {
    try {
      console.log('Sending forgot password OTP request:', { emailOrPhone });
      const response = await axios.post(`${API_URL}/api/auth/forgot-password-otp`, {
        emailOrPhone,
      });
      return { success: true, message: response.data.message };
    } catch (error) {
      console.error('Send forgot password OTP error:', error);
      return { success: false, message: error.response?.data?.message || 'Failed to send OTP' };
    }
  };

  // Reset password with OTP
  const resetPassword = async (emailOrPhone, otp, newPassword) => {
    try {
      console.log('Sending reset password request:', { emailOrPhone, otp });
      const response = await axios.post(`${API_URL}/api/auth/reset-password`, {
        emailOrPhone,
        otp,
        newPassword,
      });
      return { success: true, message: response.data.message };
    } catch (error) {
      console.error('Reset password error:', error);
      return { success: false, message: error.response?.data?.message || 'Failed to reset password' };
    }
  };

  // Add to cart
  const addToCart = async (productId, quantity) => {
    try {
      if (!user) {
        return { success: false, message: 'Please log in to add items to cart', redirectToLogin: true };
      }

      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/api/cart/add`,
        { productId, quantity },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Fetch updated cart items
      const cartResponse = await axios.get(`${API_URL}/api/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const items = cartResponse.data.items || [];
      setCartItems(items);
      setCartCount(items.reduce((sum, item) => sum + item.quantity, 0));

      return { success: true, message: response.data.message };
    } catch (error) {
      console.error('Add to cart error:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        navigate('/login');
        return { success: false, message: 'Session expired. Please log in again.', redirectToLogin: true };
      }
      return { success: false, message: error.response?.data?.message || 'Failed to add to cart' };
    }
  };

  // Update cart quantity
  const updateCartQuantity = async (cartId, quantity) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${API_URL}/api/cart/update`,
        { cartId, quantity },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Fetch updated cart items
      const cartResponse = await axios.get(`${API_URL}/api/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const items = cartResponse.data.items || [];
      setCartItems(items);
      setCartCount(items.reduce((sum, item) => sum + item.quantity, 0));

      return { success: true, message: response.data.message };
    } catch (error) {
      console.error('Update cart error:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        navigate('/login');
        return { success: false, message: 'Session expired. Please log in again.', redirectToLogin: true };
      }
      return { success: false, message: error.response?.data?.message || 'Failed to update cart' };
    }
  };

  // Remove from cart
  const removeFromCart = async (cartId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`${API_URL}/api/cart/remove`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { cartId },
      });

      // Fetch updated cart items
      const cartResponse = await axios.get(`${API_URL}/api/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const items = cartResponse.data.items || [];
      setCartItems(items);
      setCartCount(items.reduce((sum, item) => sum + item.quantity, 0));

      return { success: true, message: response.data.message };
    } catch (error) {
      console.error('Remove from cart error:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        navigate('/login');
        return { success: false, message: 'Session expired. Please log in again.', redirectToLogin: true };
      }
      return { success: false, message: error.response?.data?.message || 'Failed to remove from cart' };
    }
  };

  // Add address
  const addAddress = async (addressData) => {
    try {
      if (!user) {
        return { success: false, message: 'Please log in to add an address', redirectToLogin: true };
      }

      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_URL}/api/addresses/add`, addressData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Fetch updated addresses
      const addressResponse = await axios.get(`${API_URL}/api/addresses`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAddresses(addressResponse.data.addresses || []);

      return { success: true, message: response.data.message };
    } catch (error) {
      console.error('Add address error:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        navigate('/login');
        return { success: false, message: 'Session expired. Please log in again.', redirectToLogin: true };
      }
      return { success: false, message: error.response?.data?.message || 'Failed to add address' };
    }
  };

  // Update address
  const updateAddress = async (addressData) => {
    try {
      if (!user) {
        return { success: false, message: 'Please log in to update an address', redirectToLogin: true };
      }

      const token = localStorage.getItem('token');
      const response = await axios.put(`${API_URL}/api/addresses/update`, addressData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Fetch updated addresses
      const addressResponse = await axios.get(`${API_URL}/api/addresses`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAddresses(addressResponse.data.addresses || []);

      return { success: true, message: response.data.message };
    } catch (error) {
      console.error('Update address error:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        navigate('/login');
        return { success: false, message: 'Session expired. Please log in again.', redirectToLogin: true };
      }
      return { success: false, message: error.response?.data?.message || 'Failed to update address' };
    }
  };

  // Delete address
  const deleteAddress = async (address_id) => {
    try {
      if (!user) {
        return { success: false, message: 'Please log in to delete an address', redirectToLogin: true };
      }

      const token = localStorage.getItem('token');
      const response = await axios.delete(`${API_URL}/api/addresses/delete`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { address_id },
      });

      // Fetch updated addresses
      const addressResponse = await axios.get(`${API_URL}/api/addresses`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAddresses(addressResponse.data.addresses || []);

      return { success: true, message: response.data.message };
    } catch (error) {
      console.error('Delete address error:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        navigate('/login');
        return { success: false, message: 'Session expired. Please log in again.', redirectToLogin: true };
      }
      return { success: false, message: error.response?.data?.message || 'Failed to delete address' };
    }
  };


  const createOrder = async (orderData) => {
    try {
      if (!user) {
        return { success: false, message: 'Please log in to place an order', redirectToLogin: true };
      }
  
      const token = localStorage.getItem('token');
      if (!token) {
        return { success: false, message: 'Authentication token missing', redirectToLogin: true };
      }
  
      console.log('Creating order with data:', {
        address_id: orderData.address_id,
        payment_method: orderData.payment_method
      });
  
      const response = await axios.post(`${API_URL}/api/orders/create`, 
        {
          address_id: orderData.address_id,
          payment_method: orderData.payment_method
        }, 
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        }
      );
  
      // Clear cart items in context
      setCartItems([]);
      setCartCount(0);
  
      return { 
        success: true, 
        message: response.data.message, 
        order: response.data 
      };
    } catch (error) {
      console.error('Create order error:', error);
      
      if (error.response) {
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
        console.error('Error response headers:', error.response.headers);
        
        if (error.response.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          navigate('/login');
          return { 
            success: false, 
            message: 'Session expired. Please log in again.', 
            redirectToLogin: true 
          };
        }
        
        return { 
          success: false, 
          message: error.response.data?.message || 'Failed to create order',
          error: error.response.data
        };
      } else if (error.request) {
        console.error('No response received:', error.request);
        return { 
          success: false, 
          message: 'No response from server. Please check your connection.' 
        };
      } else {
        console.error('Request setup error:', error.message);
        return { 
          success: false, 
          message: 'Error setting up request: ' + error.message 
        };
      }
    }
  };


  // Verify payment
  const verifyPayment = async (paymentData) => {
    try {
      if (!user) {
        return { success: false, message: 'Please log in to verify payment', redirectToLogin: true };
      }

      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_URL}/api/orders/verify-payment`, paymentData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return { success: true, message: response.data.message };
    } catch (error) {
      console.error('Verify payment error:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        navigate('/login');
        return { success: false, message: 'Session expired. Please log in again.', redirectToLogin: true };
      }
      return { success: false, message: error.response?.data?.message || 'Failed to verify payment' };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        cartItems,
        cartCount,
        addresses,
        login,
        loginWithOtp,
        sendOtp,
        register,
        verifyOtp,
        logout,
        refreshToken,
        updateUser,
        sendForgotPasswordOtp,
        resetPassword,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        addAddress,
        updateAddress,
        deleteAddress,
        createOrder,
        verifyPayment,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};





























































// import React, { createContext, useState, useEffect } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [cartItems, setCartItems] = useState([]);
//   const [cartCount, setCartCount] = useState(0);
//   const navigate = useNavigate();
//   const API_URL = 'http://localhost:5376';

//   // Fetch user and cart on app load
//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       axios
//         .get(`${API_URL}/api/auth/me`, {
//           headers: { Authorization: `Bearer ${token}` },
//         })
//         .then((response) => {
//           setUser(response.data.user);
//         })
//         .catch(async (error) => {
//           console.error('Error fetching user:', error);
//           if (error.response?.status === 401) {
//             const newToken = await refreshToken();
//             if (newToken) {
//               axios
//                 .get(`${API_URL}/api/auth/me`, {
//                   headers: { Authorization: `Bearer ${newToken}` },
//                 })
//                 .then((response) => {
//                   setUser(response.data.user);
//                 })
//                 .catch(() => {
//                   localStorage.removeItem('token');
//                   localStorage.removeItem('refreshToken');
//                   navigate('/login');
//                 });
//             } else {
//               localStorage.removeItem('token');
//               localStorage.removeItem('refreshToken');
//               navigate('/login');
//             }
//           }
//         })
//         .finally(() => setLoading(false));
//     } else {
//       setLoading(false);
//     }
//   }, [navigate]);

//   // Fetch cart items when user changes
//   useEffect(() => {
//     const fetchCartItems = async () => {
//       if (user) {
//         try {
//           const token = localStorage.getItem('token');
//           const response = await axios.get(`${API_URL}/api/cart`, {
//             headers: { Authorization: `Bearer ${token}` },
//           });
//           const items = response.data.items || [];
//           setCartItems(items);
//           setCartCount(items.reduce((sum, item) => sum + item.quantity, 0));
//         } catch (err) {
//           console.error('Error fetching cart items:', err);
//           setCartItems([]);
//           setCartCount(0);
//         }
//       } else {
//         setCartItems([]);
//         setCartCount(0);
//       }
//     };

//     fetchCartItems();
//   }, [user]);

//   // Refresh token
//   const refreshToken = async () => {
//     try {
//       const refreshToken = localStorage.getItem('refreshToken');
//       if (!refreshToken) {
//         throw new Error('No refresh token available');
//       }
//       const response = await axios.post(`${API_URL}/api/auth/refresh-token`, {
//         refreshToken,
//       });
//       const { token } = response.data;
//       localStorage.setItem('token', token);
//       return token;
//     } catch (error) {
//       console.error('Refresh token error:', error);
//       localStorage.removeItem('token');
//       localStorage.removeItem('refreshToken');
//       navigate('/login');
//       return null;
//     }
//   };

//   // Login with email/phone and password
//   const login = async (emailOrPhone, password) => {
//     try {
//       console.log('Sending login request:', { emailOrPhone });
//       const response = await axios.post(`${API_URL}/api/auth/login`, {
//         emailOrPhone,
//         password,
//       });
//       const { token, refreshToken, message } = response.data;
//       localStorage.setItem('token', token);
//       localStorage.setItem('refreshToken', refreshToken);
//       const userResponse = await axios.get(`${API_URL}/api/auth/me`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setUser(userResponse.data.user);
//       return { success: true, message };
//     } catch (error) {
//       console.error('Login error:', error);
//       if (error.response?.status === 401) {
//         localStorage.removeItem('token');
//         localStorage.removeItem('refreshToken');
//         navigate('/login');
//         return { success: false, message: 'Session expired. Please log in again.' };
//       }
//       return { success: false, message: error.response?.data?.message || 'Login failed' };
//     }
//   };

//   // Login with OTP
//   const loginWithOtp = async (emailOrPhone, otp) => {
//     try {
//       console.log('Sending login-otp request:', { emailOrPhone, otp });
//       const response = await axios.post(`${API_URL}/api/auth/login-otp`, {
//         emailOrPhone,
//         otp,
//       });
//       const { token, refreshToken, message } = response.data;
//       localStorage.setItem('token', token);
//       localStorage.setItem('refreshToken', refreshToken);
//       const userResponse = await axios.get(`${API_URL}/api/auth/me`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setUser(userResponse.data.user);
//       return { success: true, message };
//     } catch (error) {
//       console.error('Login OTP error:', error);
//       if (error.response?.status === 401) {
//         localStorage.removeItem('token');
//         localStorage.removeItem('refreshToken');
//         navigate('/login');
//         return { success: false, message: 'Session expired. Please log in again.' };
//       }
//       return { success: false, message: error.response?.data?.message || 'OTP login failed' };
//     }
//   };

//   // Send OTP for login
//   const sendOtp = async (emailOrPhone) => {
//     try {
//       console.log('Sending OTP request:', { emailOrPhone });
//       const response = await axios.post(`${API_URL}/api/auth/send-otp`, {
//         emailOrPhone,
//       });
//       return { success: true, message: response.data.message };
//     } catch (error) {
//       console.error('Send OTP error:', error);
//       return { success: false, message: error.response?.data?.message || 'Failed to send OTP' };
//     }
//   };

//   // Register with OTP
//   const register = async (userData) => {
//     try {
//       console.log('Sending register request:', userData);
//       const response = await axios.post(`${API_URL}/api/auth/register-otp`, userData);
//       return { success: true, message: response.data.message };
//     } catch (error) {
//       console.error('Register error:', error);
//       return { success: false, message: error.response?.data?.message || 'Registration failed' };
//     }
//   };

//   // Verify OTP for registration
//   const verifyOtp = async (email, otp) => {
//     try {
//       console.log('Sending verify OTP request:', { email, otp });
//       const response = await axios.post(`${API_URL}/api/auth/verify-otp`, {
//         email,
//         otp,
//       });
//       const { token, refreshToken, message } = response.data;
//       localStorage.setItem('token', token);
//       localStorage.setItem('refreshToken', refreshToken);
//       const userResponse = await axios.get(`${API_URL}/api/auth/me`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setUser(userResponse.data.user);
//       return { success: true, message };
//     } catch (error) {
//       console.error('Verify OTP error:', error);
//       if (error.response?.status === 401) {
//         localStorage.removeItem('token');
//         localStorage.removeItem('refreshToken');
//         navigate('/login');
//         return { success: false, message: 'Session expired. Please log in again.' };
//       }
//       return { success: false, message: error.response?.data?.message || 'OTP verification failed' };
//     }
//   };

//   // Logout
//   const logout = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       await axios.post(
//         `${API_URL}/api/auth/logout`,
//         {},
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//     } catch (error) {
//       console.error('Logout error:', error);
//     } finally {
//       localStorage.removeItem('token');
//       localStorage.removeItem('refreshToken');
//       setUser(null);
//       setCartItems([]);
//       setCartCount(0);
//       navigate('/');
//     }
//   };

//   // Update user data in context
//   const updateUser = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         throw new Error('No token available');
//       }
//       const userResponse = await axios.get(`${API_URL}/api/auth/me`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setUser(userResponse.data.user);
//       return { success: true, message: 'User data updated' };
//     } catch (error) {
//       console.error('Update user error:', error);
//       if (error.response?.status === 401) {
//         const newToken = await refreshToken();
//         if (newToken) {
//           const userResponse = await axios.get(`${API_URL}/api/auth/me`, {
//             headers: { Authorization: `Bearer ${newToken}` },
//           });
//           setUser(userResponse.data.user);
//           return { success: true, message: 'User data updated' };
//         } else {
//           localStorage.removeItem('token');
//           localStorage.removeItem('refreshToken');
//           navigate('/login');
//           return { success: false, message: 'Session expired. Please log in again.' };
//         }
//       }
//       return { success: false, message: error.response?.data?.message || 'Failed to update user data' };
//     }
//   };

//   // Send OTP for forgot password
//   const sendForgotPasswordOtp = async (emailOrPhone) => {
//     try {
//       console.log('Sending forgot password OTP request:', { emailOrPhone });
//       const response = await axios.post(`${API_URL}/api/auth/forgot-password-otp`, {
//         emailOrPhone,
//       });
//       return { success: true, message: response.data.message };
//     } catch (error) {
//       console.error('Send forgot password OTP error:', error);
//       return { success: false, message: error.response?.data?.message || 'Failed to send OTP' };
//     }
//   };

//   // Reset password with OTP
//   const resetPassword = async (emailOrPhone, otp, newPassword) => {
//     try {
//       console.log('Sending reset password request:', { emailOrPhone, otp });
//       const response = await axios.post(`${API_URL}/api/auth/reset-password`, {
//         emailOrPhone,
//         otp,
//         newPassword,
//       });
//       return { success: true, message: response.data.message };
//     } catch (error) {
//       console.error('Reset password error:', error);
//       return { success: false, message: error.response?.data?.message || 'Failed to reset password' };
//     }
//   };

//   // Add to cart
//   const addToCart = async (productId, quantity) => {
//     try {
//       if (!user) {
//         return { success: false, message: 'Please log in to add items to cart', redirectToLogin: true };
//       }

//       const token = localStorage.getItem('token');
//       const response = await axios.post(
//         `${API_URL}/api/cart/add`,
//         { productId, quantity },
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       // Fetch updated cart items
//       const cartResponse = await axios.get(`${API_URL}/api/cart`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const items = cartResponse.data.items || [];
//       setCartItems(items);
//       setCartCount(items.reduce((sum, item) => sum + item.quantity, 0));

//       return { success: true, message: response.data.message };
//     } catch (error) {
//       console.error('Add to cart error:', error);
//       if (error.response?.status === 401) {
//         localStorage.removeItem('token');
//         localStorage.removeItem('refreshToken');
//         navigate('/login');
//         return { success: false, message: 'Session expired. Please log in again.', redirectToLogin: true };
//       }
//       return { success: false, message: error.response?.data?.message || 'Failed to add to cart' };
//     }
//   };

//   // Update cart quantity
//   const updateCartQuantity = async (cartId, quantity) => {
//     try {
//       const token = localStorage.getItem('token');
//       const response = await axios.put(
//         `${API_URL}/api/cart/update`,
//         { cartId, quantity },
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       // Fetch updated cart items
//       const cartResponse = await axios.get(`${API_URL}/api/cart`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const items = cartResponse.data.items || [];
//       setCartItems(items);
//       setCartCount(items.reduce((sum, item) => sum + item.quantity, 0));

//       return { success: true, message: response.data.message };
//     } catch (error) {
//       console.error('Update cart error:', error);
//       if (error.response?.status === 401) {
//         localStorage.removeItem('token');
//         localStorage.removeItem('refreshToken');
//         navigate('/login');
//         return { success: false, message: 'Session expired. Please log in again.', redirectToLogin: true };
//       }
//       return { success: false, message: error.response?.data?.message || 'Failed to update cart' };
//     }
//   };

//   // Remove from cart
//   const removeFromCart = async (cartId) => {
//     try {
//       const token = localStorage.getItem('token');
//       const response = await axios.delete(`${API_URL}/api/cart/remove`, {
//         headers: { Authorization: `Bearer ${token}` },
//         data: { cartId },
//       });

//       // Fetch updated cart items
//       const cartResponse = await axios.get(`${API_URL}/api/cart`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const items = cartResponse.data.items || [];
//       setCartItems(items);
//       setCartCount(items.reduce((sum, item) => sum + item.quantity, 0));

//       return { success: true, message: response.data.message };
//     } catch (error) {
//       console.error('Remove from cart error:', error);
//       if (error.response?.status === 401) {
//         localStorage.removeItem('token');
//         localStorage.removeItem('refreshToken');
//         navigate('/login');
//         return { success: false, message: 'Session expired. Please log in again.', redirectToLogin: true };
//       }
//       return { success: false, message: error.response?.data?.message || 'Failed to remove from cart' };
//     }
//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         loading,
//         cartItems,
//         cartCount,
//         login,
//         loginWithOtp,
//         sendOtp,
//         register,
//         verifyOtp,
//         logout,
//         refreshToken,
//         updateUser,
//         sendForgotPasswordOtp,
//         resetPassword,
//         addToCart,
//         updateCartQuantity,
//         removeFromCart,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

















































// import React, { createContext, useState, useEffect } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();
//   const API_URL = 'http://localhost:5376';

//   // Check if user is logged in on app load
//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       axios
//         .get(`${API_URL}/api/auth/me`, {
//           headers: { Authorization: `Bearer ${token}` },
//         })
//         .then((response) => {
//           setUser(response.data.user);
//         })
//         .catch(async (error) => {
//           console.error('Error fetching user:', error);
//           if (error.response?.status === 401) {
//             const newToken = await refreshToken();
//             if (newToken) {
//               // Retry the request with the new token
//               axios
//                 .get(`${API_URL}/api/auth/me`, {
//                   headers: { Authorization: `Bearer ${newToken}` },
//                 })
//                 .then((response) => {
//                   setUser(response.data.user);
//                 })
//                 .catch(() => {
//                   localStorage.removeItem('token');
//                   localStorage.removeItem('refreshToken');
//                   navigate('/login');
//                 });
//             } else {
//               localStorage.removeItem('token');
//               localStorage.removeItem('refreshToken');
//               navigate('/login');
//             }
//           }
//         })
//         .finally(() => setLoading(false));
//     } else {
//       setLoading(false);
//     }
//   }, [navigate]);

//   // Refresh token
//   const refreshToken = async () => {
//     try {
//       const refreshToken = localStorage.getItem('refreshToken');
//       if (!refreshToken) {
//         throw new Error('No refresh token available');
//       }
//       const response = await axios.post(`${API_URL}/api/auth/refresh-token`, {
//         refreshToken,
//       });
//       const { token } = response.data;
//       localStorage.setItem('token', token);
//       return token;
//     } catch (error) {
//       console.error('Refresh token error:', error);
//       localStorage.removeItem('token');
//       localStorage.removeItem('refreshToken');
//       navigate('/login');
//       return null;
//     }
//   };

//   // Login with email/phone and password
//   const login = async (emailOrPhone, password) => {
//     try {
//       console.log('Sending login request:', { emailOrPhone });
//       const response = await axios.post(`${API_URL}/api/auth/login`, {
//         emailOrPhone,
//         password,
//       });
//       const { token, refreshToken, message } = response.data;
//       localStorage.setItem('token', token);
//       localStorage.setItem('refreshToken', refreshToken);
//       const userResponse = await axios.get(`${API_URL}/api/auth/me`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setUser(userResponse.data.user);
//       return { success: true, message };
//     } catch (error) {
//       console.error('Login error:', error);
//       if (error.response?.status === 401) {
//         localStorage.removeItem('token');
//         localStorage.removeItem('refreshToken');
//         navigate('/login');
//         return { success: false, message: 'Session expired. Please log in again.' };
//       }
//       return { success: false, message: error.response?.data?.message || 'Login failed' };
//     }
//   };

//   // Login with OTP
//   const loginWithOtp = async (emailOrPhone, otp) => {
//     try {
//       console.log('Sending login-otp request:', { emailOrPhone, otp });
//       const response = await axios.post(`${API_URL}/api/auth/login-otp`, {
//         emailOrPhone,
//         otp,
//       });
//       const { token, refreshToken, message } = response.data;
//       localStorage.setItem('token', token);
//       localStorage.setItem('refreshToken', refreshToken);
//       const userResponse = await axios.get(`${API_URL}/api/auth/me`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setUser(userResponse.data.user);
//       return { success: true, message };
//     } catch (error) {
//       console.error('Login OTP error:', error);
//       if (error.response?.status === 401) {
//         localStorage.removeItem('token');
//         localStorage.removeItem('refreshToken');
//         navigate('/login');
//         return { success: false, message: 'Session expired. Please log in again.' };
//       }
//       return { success: false, message: error.response?.data?.message || 'OTP login failed' };
//     }
//   };

//   // Send OTP for login
//   const sendOtp = async (emailOrPhone) => {
//     try {
//       console.log('Sending OTP request:', { emailOrPhone });
//       const response = await axios.post(`${API_URL}/api/auth/send-otp`, {
//         emailOrPhone,
//       });
//       return { success: true, message: response.data.message };
//     } catch (error) {
//       console.error('Send OTP error:', error);
//       return { success: false, message: error.response?.data?.message || 'Failed to send OTP' };
//     }
//   };

//   // Register with OTP
//   const register = async (userData) => {
//     try {
//       console.log('Sending register request:', userData);
//       const response = await axios.post(`${API_URL}/api/auth/register-otp`, userData);
//       return { success: true, message: response.data.message };
//     } catch (error) {
//       console.error('Register error:', error);
//       return { success: false, message: error.response?.data?.message || 'Registration failed' };
//     }
//   };

//   // Verify OTP for registration
//   const verifyOtp = async (email, otp) => {
//     try {
//       console.log('Sending verify OTP request:', { email, otp });
//       const response = await axios.post(`${API_URL}/api/auth/verify-otp`, {
//         email,
//         otp,
//       });
//       const { token, refreshToken, message } = response.data;
//       localStorage.setItem('token', token);
//       localStorage.setItem('refreshToken', refreshToken);
//       const userResponse = await axios.get(`${API_URL}/api/auth/me`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setUser(userResponse.data.user);
//       return { success: true, message };
//     } catch (error) {
//       console.error('Verify OTP error:', error);
//       if (error.response?.status === 401) {
//         localStorage.removeItem('token');
//         localStorage.removeItem('refreshToken');
//         navigate('/login');
//         return { success: false, message: 'Session expired. Please log in again.' };
//       }
//       return { success: false, message: error.response?.data?.message || 'OTP verification failed' };
//     }
//   };

//   // Logout
//   const logout = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       await axios.post(
//         `${API_URL}/api/auth/logout`,
//         {},
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//     } catch (error) {
//       console.error('Logout error:', error);
//     } finally {
//       localStorage.removeItem('token');
//       localStorage.removeItem('refreshToken');
//       setUser(null);
//       navigate('/');
//     }
//   };

//   // Update user data in context
//   const updateUser = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         throw new Error('No token available');
//       }
//       const userResponse = await axios.get(`${API_URL}/api/auth/me`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setUser(userResponse.data.user);
//       return { success: true, message: 'User data updated' };
//     } catch (error) {
//       console.error('Update user error:', error);
//       if (error.response?.status === 401) {
//         const newToken = await refreshToken();
//         if (newToken) {
//           // Retry the request with the new token
//           const userResponse = await axios.get(`${API_URL}/api/auth/me`, {
//             headers: { Authorization: `Bearer ${newToken}` },
//           });
//           setUser(userResponse.data.user);
//           return { success: true, message: 'User data updated' };
//         } else {
//           localStorage.removeItem('token');
//           localStorage.removeItem('refreshToken');
//           navigate('/login');
//           return { success: false, message: 'Session expired. Please log in again.' };
//         }
//       }
//       return { success: false, message: error.response?.data?.message || 'Failed to update user data' };
//     }
//   };

//   // New: Send OTP for forgot password
//   const sendForgotPasswordOtp = async (emailOrPhone) => {
//     try {
//       console.log('Sending forgot password OTP request:', { emailOrPhone });
//       const response = await axios.post(`${API_URL}/api/auth/forgot-password-otp`, {
//         emailOrPhone,
//       });
//       return { success: true, message: response.data.message };
//     } catch (error) {
//       console.error('Send forgot password OTP error:', error);
//       return { success: false, message: error.response?.data?.message || 'Failed to send OTP' };
//     }
//   };

//   // New: Reset password with OTP
//   const resetPassword = async (emailOrPhone, otp, newPassword) => {
//     try {
//       console.log('Sending reset password request:', { emailOrPhone, otp });
//       const response = await axios.post(`${API_URL}/api/auth/reset-password`, {
//         emailOrPhone,
//         otp,
//         newPassword,
//       });
//       return { success: true, message: response.data.message };
//     } catch (error) {
//       console.error('Reset password error:', error);
//       return { success: false, message: error.response?.data?.message || 'Failed to reset password' };
//     }
//   };

//   const addToCart = async (productId, quantity) => {
//     try {
//       if (!user) {
//         return { success: false, message: 'Please log in to add items to cart', redirectToLogin: true };
//       }

//       const token = localStorage.getItem('token');
//       const response = await axios.post(
//         `${API_URL}/api/cart/add`,
//         { productId, quantity },
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       return { success: true, message: response.data.message };
//     } catch (error) {
//       console.error('Add to cart error:', error);
//       if (error.response?.status === 401) {
//         localStorage.removeItem('token');
//         localStorage.removeItem('refreshToken');
//         navigate('/login');
//         return { success: false, message: 'Session expired. Please log in again.', redirectToLogin: true };
//       }
//       return { success: false, message: error.response?.data?.message || 'Failed to add to cart' };
//     }
//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         loading,
//         login,
//         loginWithOtp,
//         sendOtp,
//         register,
//         verifyOtp,
//         logout,
//         refreshToken,
//         updateUser,
//         sendForgotPasswordOtp,
//         resetPassword,
//         addToCart
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };





























// import React, { createContext, useState, useEffect } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();
//   const API_URL = 'http://localhost:5376';

//   // Check if user is logged in on app load
//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       axios
//         .get(`${API_URL}/api/auth/me`, {
//           headers: { Authorization: `Bearer ${token}` },
//         })
//         .then((response) => {
//           setUser(response.data.user);
//         })
//         .catch(async (error) => {
//           console.error('Error fetching user:', error);
//           if (error.response?.status === 401) {
//             const newToken = await refreshToken();
//             if (newToken) {
//               // Retry the request with the new token
//               axios
//                 .get(`${API_URL}/api/auth/me`, {
//                   headers: { Authorization: `Bearer ${newToken}` },
//                 })
//                 .then((response) => {
//                   setUser(response.data.user);
//                 })
//                 .catch(() => {
//                   localStorage.removeItem('token');
//                   localStorage.removeItem('refreshToken');
//                   navigate('/login');
//                 });
//             } else {
//               localStorage.removeItem('token');
//               localStorage.removeItem('refreshToken');
//               navigate('/login');
//             }
//           }
//         })
//         .finally(() => setLoading(false));
//     } else {
//       setLoading(false);
//     }
//   }, [navigate]);

//   // Refresh token
//   const refreshToken = async () => {
//     try {
//       const refreshToken = localStorage.getItem('refreshToken');
//       if (!refreshToken) {
//         throw new Error('No refresh token available');
//       }
//       const response = await axios.post(`${API_URL}/api/auth/refresh-token`, {
//         refreshToken,
//       });
//       const { token } = response.data;
//       localStorage.setItem('token', token);
//       return token;
//     } catch (error) {
//       console.error('Refresh token error:', error);
//       localStorage.removeItem('token');
//       localStorage.removeItem('refreshToken');
//       navigate('/login');
//       return null;
//     }
//   };

//   // Login with email/phone and password
//   const login = async (emailOrPhone, password) => {
//     try {
//       console.log('Sending login request:', { emailOrPhone });
//       const response = await axios.post(`${API_URL}/api/auth/login`, {
//         emailOrPhone,
//         password,
//       });
//       const { token, refreshToken, message } = response.data;
//       localStorage.setItem('token', token);
//       localStorage.setItem('refreshToken', refreshToken);
//       const userResponse = await axios.get(`${API_URL}/api/auth/me`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setUser(userResponse.data.user);
//       return { success: true, message };
//     } catch (error) {
//       console.error('Login error:', error);
//       if (error.response?.status === 401) {
//         localStorage.removeItem('token');
//         localStorage.removeItem('refreshToken');
//         navigate('/login');
//         return { success: false, message: 'Session expired. Please log in again.' };
//       }
//       return { success: false, message: error.response?.data?.message || 'Login failed' };
//     }
//   };

//   // Login with OTP
//   const loginWithOtp = async (emailOrPhone, otp) => {
//     try {
//       console.log('Sending login-otp request:', { emailOrPhone, otp });
//       const response = await axios.post(`${API_URL}/api/auth/login-otp`, {
//         emailOrPhone,
//         otp,
//       });
//       const { token, refreshToken, message } = response.data;
//       localStorage.setItem('token', token);
//       localStorage.setItem('refreshToken', refreshToken);
//       const userResponse = await axios.get(`${API_URL}/api/auth/me`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setUser(userResponse.data.user);
//       return { success: true, message };
//     } catch (error) {
//       console.error('Login OTP error:', error);
//       if (error.response?.status === 401) {
//         localStorage.removeItem('token');
//         localStorage.removeItem('refreshToken');
//         navigate('/login');
//         return { success: false, message: 'Session expired. Please log in again.' };
//       }
//       return { success: false, message: error.response?.data?.message || 'OTP login failed' };
//     }
//   };

//   // Send OTP for login
//   const sendOtp = async (emailOrPhone) => {
//     try {
//       console.log('Sending OTP request:', { emailOrPhone });
//       const response = await axios.post(`${API_URL}/api/auth/send-otp`, {
//         emailOrPhone,
//       });
//       return { success: true, message: response.data.message };
//     } catch (error) {
//       console.error('Send OTP error:', error);
//       return { success: false, message: error.response?.data?.message || 'Failed to send OTP' };
//     }
//   };

//   // Register with OTP
//   const register = async (userData) => {
//     try {
//       console.log('Sending register request:', userData);
//       const response = await axios.post(`${API_URL}/api/auth/register-otp`, userData);
//       return { success: true, message: response.data.message };
//     } catch (error) {
//       console.error('Register error:', error);
//       return { success: false, message: error.response?.data?.message || 'Registration failed' };
//     }
//   };

//   // Verify OTP for registration
//   const verifyOtp = async (email, otp) => {
//     try {
//       console.log('Sending verify OTP request:', { email, otp });
//       const response = await axios.post(`${API_URL}/api/auth/verify-otp`, {
//         email,
//         otp,
//       });
//       const { token, refreshToken, message } = response.data;
//       localStorage.setItem('token', token);
//       localStorage.setItem('refreshToken', refreshToken);
//       const userResponse = await axios.get(`${API_URL}/api/auth/me`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setUser(userResponse.data.user);
//       return { success: true, message };
//     } catch (error) {
//       console.error('Verify OTP error:', error);
//       if (error.response?.status === 401) {
//         localStorage.removeItem('token');
//         localStorage.removeItem('refreshToken');
//         navigate('/login');
//         return { success: false, message: 'Session expired. Please log in again.' };
//       }
//       return { success: false, message: error.response?.data?.message || 'OTP verification failed' };
//     }
//   };

//   // Logout
//   const logout = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       await axios.post(
//         `${API_URL}/api/auth/logout`,
//         {},
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//     } catch (error) {
//       console.error('Logout error:', error);
//     } finally {
//       localStorage.removeItem('token');
//       localStorage.removeItem('refreshToken');
//       setUser(null);
//       navigate('/');
//     }
//   };

//   // New: Update user data in context
//   const updateUser = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         throw new Error('No token available');
//       }
//       const userResponse = await axios.get(`${API_URL}/api/auth/me`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setUser(userResponse.data.user);
//       return { success: true, message: 'User data updated' };
//     } catch (error) {
//       console.error('Update user error:', error);
//       if (error.response?.status === 401) {
//         const newToken = await refreshToken();
//         if (newToken) {
//           // Retry the request with the new token
//           const userResponse = await axios.get(`${API_URL}/api/auth/me`, {
//             headers: { Authorization: `Bearer ${newToken}` },
//           });
//           setUser(userResponse.data.user);
//           return { success: true, message: 'User data updated' };
//         } else {
//           localStorage.removeItem('token');
//           localStorage.removeItem('refreshToken');
//           navigate('/login');
//           return { success: false, message: 'Session expired. Please log in again.' };
//         }
//       }
//       return { success: false, message: error.response?.data?.message || 'Failed to update user data' };
//     }
//   };

//   return (
//     <AuthContext.Provider
//       value={{ user, loading, login, loginWithOtp, sendOtp, register, verifyOtp, logout, refreshToken, updateUser }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };





























// import React, { createContext, useState, useEffect } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();
//   const API_URL = 'http://localhost:5376';

//   // Check if user is logged in on app load
//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       axios
//         .get(`${API_URL}/api/auth/me`, {
//           headers: { Authorization: `Bearer ${token}` },
//         })
//         .then((response) => {
//           setUser(response.data.user);
//         })
//         .catch(async (error) => {
//           console.error('Error fetching user:', error);
//           if (error.response?.status === 401) {
//             const newToken = await refreshToken();
//             if (newToken) {
//               // Retry the request with the new token
//               axios
//                 .get(`${API_URL}/api/auth/me`, {
//                   headers: { Authorization: `Bearer ${newToken}` },
//                 })
//                 .then((response) => {
//                   setUser(response.data.user);
//                 })
//                 .catch(() => {
//                   localStorage.removeItem('token');
//                   localStorage.removeItem('refreshToken');
//                   navigate('/login');
//                 });
//             } else {
//               localStorage.removeItem('token');
//               localStorage.removeItem('refreshToken');
//               navigate('/login');
//             }
//           }
//         })
//         .finally(() => setLoading(false));
//     } else {
//       setLoading(false);
//     }
//   }, [navigate]);

//   // Refresh token
//   const refreshToken = async () => {
//     try {
//       const refreshToken = localStorage.getItem('refreshToken');
//       if (!refreshToken) {
//         throw new Error('No refresh token available');
//       }
//       const response = await axios.post(`${API_URL}/api/auth/refresh-token`, {
//         refreshToken,
//       });
//       const { token } = response.data;
//       localStorage.setItem('token', token);
//       return token;
//     } catch (error) {
//       console.error('Refresh token error:', error);
//       localStorage.removeItem('token');
//       localStorage.removeItem('refreshToken');
//       navigate('/login');
//       return null;
//     }
//   };

//   // Login with email/phone and password
//   const login = async (emailOrPhone, password) => {
//     try {
//       console.log('Sending login request:', { emailOrPhone });
//       const response = await axios.post(`${API_URL}/api/auth/login`, {
//         emailOrPhone,
//         password,
//       });
//       const { token, refreshToken, message } = response.data;
//       localStorage.setItem('token', token);
//       localStorage.setItem('refreshToken', refreshToken);
//       const userResponse = await axios.get(`${API_URL}/api/auth/me`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setUser(userResponse.data.user);
//       return { success: true, message };
//     } catch (error) {
//       console.error('Login error:', error);
//       if (error.response?.status === 401) {
//         localStorage.removeItem('token');
//         localStorage.removeItem('refreshToken');
//         navigate('/login');
//         return { success: false, message: 'Session expired. Please log in again.' };
//       }
//       return { success: false, message: error.response?.data?.message || 'Login failed' };
//     }
//   };

//   // Login with OTP
//   const loginWithOtp = async (emailOrPhone, otp) => {
//     try {
//       console.log('Sending login-otp request:', { emailOrPhone, otp });
//       const response = await axios.post(`${API_URL}/api/auth/login-otp`, {
//         emailOrPhone,
//         otp,
//       });
//       const { token, refreshToken, message } = response.data;
//       localStorage.setItem('token', token);
//       localStorage.setItem('refreshToken', refreshToken);
//       const userResponse = await axios.get(`${API_URL}/api/auth/me`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setUser(userResponse.data.user);
//       return { success: true, message };
//     } catch (error) {
//       console.error('Login OTP error:', error);
//       if (error.response?.status === 401) {
//         localStorage.removeItem('token');
//         localStorage.removeItem('refreshToken');
//         navigate('/login');
//         return { success: false, message: 'Session expired. Please log in again.' };
//       }
//       return { success: false, message: error.response?.data?.message || 'OTP login failed' };
//     }
//   };

//   // Send OTP for login
//   const sendOtp = async (emailOrPhone) => {
//     try {
//       console.log('Sending OTP request:', { emailOrPhone });
//       const response = await axios.post(`${API_URL}/api/auth/send-otp`, {
//         emailOrPhone,
//       });
//       return { success: true, message: response.data.message };
//     } catch (error) {
//       console.error('Send OTP error:', error);
//       return { success: false, message: error.response?.data?.message || 'Failed to send OTP' };
//     }
//   };

//   // Register with OTP
//   const register = async (userData) => {
//     try {
//       console.log('Sending register request:', userData);
//       const response = await axios.post(`${API_URL}/api/auth/register-otp`, userData);
//       return { success: true, message: response.data.message };
//     } catch (error) {
//       console.error('Register error:', error);
//       return { success: false, message: error.response?.data?.message || 'Registration failed' };
//     }
//   };

//   // Verify OTP for registration
//   const verifyOtp = async (email, otp) => {
//     try {
//       console.log('Sending verify OTP request:', { email, otp });
//       const response = await axios.post(`${API_URL}/api/auth/verify-otp`, {
//         email,
//         otp,
//       });
//       const { token, refreshToken, message } = response.data;
//       localStorage.setItem('token', token);
//       localStorage.setItem('refreshToken', refreshToken);
//       const userResponse = await axios.get(`${API_URL}/api/auth/me`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setUser(userResponse.data.user);
//       return { success: true, message };
//     } catch (error) {
//       console.error('Verify OTP error:', error);
//       if (error.response?.status === 401) {
//         localStorage.removeItem('token');
//         localStorage.removeItem('refreshToken');
//         navigate('/login');
//         return { success: false, message: 'Session expired. Please log in again.' };
//       }
//       return { success: false, message: error.response?.data?.message || 'OTP verification failed' };
//     }
//   };

//   // Logout
//   const logout = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       await axios.post(
//         `${API_URL}/api/auth/logout`,
//         {},
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//     } catch (error) {
//       console.error('Logout error:', error);
//     } finally {
//       localStorage.removeItem('token');
//       localStorage.removeItem('refreshToken');
//       setUser(null);
//       navigate('/');
//     }
//   };

//   return (
//     <AuthContext.Provider
//       value={{ user, loading, login, loginWithOtp, sendOtp, register, verifyOtp, logout, refreshToken }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };






























// import React, { createContext, useState, useEffect } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   // Check if user is logged in on app load
//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       axios
//         .get('http://localhost:5376/api/auth/me', {
//           headers: { Authorization: `Bearer ${token}` },
//         })
//         .then((response) => {
//           setUser(response.data.user);
//         })
//         .catch(async (error) => {
//           if (error.response?.status === 401) {
//             const newToken = await refreshToken();
//             if (newToken) {
//               // Retry the request with the new token
//               axios
//                 .get('http://localhost:5376/api/auth/me', {
//                   headers: { Authorization: `Bearer ${newToken}` },
//                 })
//                 .then((response) => {
//                   setUser(response.data.user);
//                 })
//                 .catch(() => {
//                   localStorage.removeItem('token');
//                   localStorage.removeItem('refreshToken');
//                   navigate('/login');
//                 });
//             } else {
//               localStorage.removeItem('token');
//               localStorage.removeItem('refreshToken');
//               navigate('/login');
//             }
//           }
//         })
//         .finally(() => setLoading(false));
//     } else {
//       setLoading(false);
//     }
//   }, [navigate]);

//   // Refresh token
//   const refreshToken = async () => {
//     try {
//       const refreshToken = localStorage.getItem('refreshToken');
//       if (!refreshToken) {
//         throw new Error('No refresh token available');
//       }
//       const response = await axios.post('http://localhost:5376/api/auth/refresh-token', {
//         refreshToken,
//       });
//       const { token } = response.data;
//       localStorage.setItem('token', token);
//       return token;
//     } catch (error) {
//       localStorage.removeItem('token');
//       localStorage.removeItem('refreshToken');
//       navigate('/login');
//       return null;
//     }
//   };

//   // Login with email/phone and password
//   const login = async (emailOrPhone, password) => {
//     try {
//       const response = await axios.post('http://localhost:5376/api/auth/login', {
//         emailOrPhone,
//         password,
//       });
//       const { token, refreshToken, message } = response.data;
//       localStorage.setItem('token', token);
//       localStorage.setItem('refreshToken', refreshToken);
//       const userResponse = await axios.get('http://localhost:5376/api/auth/me', {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setUser(userResponse.data.user);
//       return { success: true, message };
//     } catch (error) {
//       if (error.response?.status === 401) {
//         localStorage.removeItem('token');
//         localStorage.removeItem('refreshToken');
//         navigate('/login');
//         return { success: false, message: 'Session expired. Please log in again.' };
//       }
//       return { success: false, message: error.response?.data?.message || 'Login failed' };
//     }
//   };

//   // Login with OTP
//   const loginWithOtp = async (emailOrPhone, otp) => {
//     try {
//       const response = await axios.post('http://localhost:5376/api/auth/login-otp', {
//         emailOrPhone,
//         otp,
//       });
//       const { token, refreshToken, message } = response.data;
//       localStorage.setItem('token', token);
//       localStorage.setItem('refreshToken', refreshToken);
//       const userResponse = await axios.get('http://localhost:5376/api/auth/me', {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setUser(userResponse.data.user);
//       return { success: true, message };
//     } catch (error) {
//       if (error.response?.status === 401) {
//         localStorage.removeItem('token');
//         localStorage.removeItem('refreshToken');
//         navigate('/login');
//         return { success: false, message: 'Session expired. Please log in again.' };
//       }
//       return { success: false, message: error.response?.data?.message || 'OTP login failed' };
//     }
//   };

//   // Send OTP for login
//   const sendOtp = async (emailOrPhone) => {
//     try {
//       const response = await axios.post('http://localhost:5376/api/auth/send-otp', {
//         emailOrPhone,
//       });
//       return { success: true, message: response.data.message };
//     } catch (error) {
//       return { success: false, message: error.response?.data?.message || 'Failed to send OTP' };
//     }
//   };

//   // Register with OTP
//   const register = async (userData) => {
//     try {
//       const response = await axios.post('http://localhost:5376/api/auth/register-otp', userData);
//       return { success: true, message: response.data.message };
//     } catch (error) {
//       return { success: false, message: error.response?.data?.message || 'Registration failed' };
//     }
//   };

//   // Verify OTP for registration
//   const verifyOtp = async (email, otp) => {
//     try {
//       const response = await axios.post('http://localhost:5376/api/auth/verify-otp', {
//         email,
//         otp,
//       });
//       const { token, refreshToken, message } = response.data;
//       localStorage.setItem('token', token);
//       localStorage.setItem('refreshToken', refreshToken);
//       const userResponse = await axios.get('http://localhost:5376/api/auth/me', {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setUser(userResponse.data.user);
//       return { success: true, message };
//     } catch (error) {
//       if (error.response?.status === 401) {
//         localStorage.removeItem('token');
//         localStorage.removeItem('refreshToken');
//         navigate('/login');
//         return { success: false, message: 'Session expired. Please log in again.' };
//       }
//       return { success: false, message: error.response?.data?.message || 'OTP verification failed' };
//     }
//   };

//   // Logout
//   const logout = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       await axios.post(
//         'http://localhost:5376/api/auth/logout',
//         {},
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//     } catch (error) {
//       console.error('Logout error:', error);
//     } finally {
//       localStorage.removeItem('token');
//       localStorage.removeItem('refreshToken');
//       setUser(null);
//       navigate('/');
//     }
//   };

//   return (
//     <AuthContext.Provider
//       value={{ user, loading, login, loginWithOtp, sendOtp, register, verifyOtp, logout, refreshToken }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };


// // import React, { createContext, useState, useEffect } from 'react';
// // import axios from 'axios';
// // import { useNavigate } from 'react-router-dom';

// // export const AuthContext = createContext();

// // export const AuthProvider = ({ children }) => {
// //   const [user, setUser] = useState(null);
// //   const [loading, setLoading] = useState(true);
// //   const navigate = useNavigate();

// //   // Check if user is logged in on app load
// // //   useEffect(() => {
// // //     const token = localStorage.getItem('token');
// // //     if (token) {
// // //       axios
// // //         .get('http://localhost:5376/api/auth/me', {
// // //           headers: { Authorization: `Bearer ${token}` },
// // //         })
// // //         .then((response) => {
// // //           setUser(response.data.user);
// // //         })
// // //         .catch(() => {
// // //           localStorage.removeItem('token');
// // //         })
// // //         .finally(() => setLoading(false));
// // //     } else {
// // //       setLoading(false);
// // //     }
// // //   }, []);

// // useEffect(() => {
// //     const token = localStorage.getItem('token');
// //     if (token) {
// //       axios
// //         .get('http://localhost:5376/api/auth/me', {
// //           headers: { Authorization: `Bearer ${token}` },
// //         })
// //         .then((response) => {
// //           setUser(response.data.user);
// //         })
// //         .catch((error) => {
// //           if (error.response?.status === 401) {
// //             // Token is invalid or expired
// //             localStorage.removeItem('token');
// //             setUser(null);
// //             navigate('/login'); // Redirect to login page
// //           }
// //         })
// //         .finally(() => setLoading(false));
// //     } else {
// //       setLoading(false);
// //     }
// //   }, [navigate]);

// //   // Login with email/phone and password
// // //   const login = async (emailOrPhone, password) => {
// // //     try {
// // //       const response = await axios.post('http://localhost:5376/api/auth/login', {
// // //         emailOrPhone,
// // //         password,
// // //       });
// // //       const { token, message } = response.data;
// // //       localStorage.setItem('token', token);
// // //       const userResponse = await axios.get('http://localhost:5376/api/auth/me', {
// // //         headers: { Authorization: `Bearer ${token}` },
// // //       });
// // //       setUser(userResponse.data.user);
// // //       return { success: true, message };
// // //     } catch (error) {
// // //       return { success: false, message: error.response?.data?.message || 'Login failed' };
// // //     }
// // //   };

// // const login = async (emailOrPhone, password) => {
// //     try {
// //       const response = await axios.post('http://localhost:5376/api/auth/login', {
// //         emailOrPhone,
// //         password,
// //       });
// //       const { token, message } = response.data;
// //       localStorage.setItem('token', token);
// //       const userResponse = await axios.get('http://localhost:5376/api/auth/me', {
// //         headers: { Authorization: `Bearer ${token}` },
// //       });
// //       setUser(userResponse.data.user);
// //       return { success: true, message };
// //     } catch (error) {
// //       if (error.response?.status === 401) {
// //         localStorage.removeItem('token');
// //         navigate('/login');
// //         return { success: false, message: 'Session expired. Please log in again.' };
// //       }
// //       return { success: false, message: error.response?.data?.message || 'Login failed' };
// //     }
// //   };

// //   // Login with OTP
// //   const loginWithOtp = async (emailOrPhone, otp) => {
// //     try {
// //       const response = await axios.post('http://localhost:5376/api/auth/login-otp', {
// //         emailOrPhone,
// //         otp,
// //       });
// //       const { token, message } = response.data;
// //       localStorage.setItem('token', token);
// //       const userResponse = await axios.get('http://localhost:5376/api/auth/me', {
// //         headers: { Authorization: `Bearer ${token}` },
// //       });
// //       setUser(userResponse.data.user);
// //       return { success: true, message };
// //     } catch (error) {
// //       return { success: false, message: error.response?.data?.message || 'OTP login failed' };
// //     }
// //   };

// //   // Send OTP for login
// //   const sendOtp = async (emailOrPhone) => {
// //     try {
// //       const response = await axios.post('http://localhost:5376/api/auth/send-otp', {
// //         emailOrPhone,
// //       });
// //       return { success: true, message: response.data.message };
// //     } catch (error) {
// //       return { success: false, message: error.response?.data?.message || 'Failed to send OTP' };
// //     }
// //   };

// //   // Register with OTP
// //   const register = async (userData) => {
// //     try {
// //       const response = await axios.post('http://localhost:5376/api/auth/register-otp', userData);
// //       return { success: true, message: response.data.message };
// //     } catch (error) {
// //       return { success: false, message: error.response?.data?.message || 'Registration failed' };
// //     }
// //   };

// //   // Verify OTP for registration
// //   const verifyOtp = async (email, otp) => {
// //     try {
// //       const response = await axios.post('http://localhost:5376/api/auth/verify-otp', {
// //         email,
// //         otp,
// //       });
// //       const { token, message } = response.data;
// //       localStorage.setItem('token', token);
// //       const userResponse = await axios.get('http://localhost:5376/api/auth/me', {
// //         headers: { Authorization: `Bearer ${token}` },
// //       });
// //       setUser(userResponse.data.user);
// //       return { success: true, message };
// //     } catch (error) {
// //       return { success: false, message: error.response?.data?.message || 'OTP verification failed' };
// //     }
// //   };

// //   // Logout
// //   const logout = async () => {
// //     try {
// //       const token = localStorage.getItem('token');
// //       await axios.post(
// //         'http://localhost:5376/api/auth/logout',
// //         {},
// //         {
// //           headers: { Authorization: `Bearer ${token}` },
// //         }
// //       );
// //     } catch (error) {
// //       console.error('Logout error:', error);
// //     } finally {
// //       localStorage.removeItem('token');
// //       setUser(null);
// //       navigate('/');
// //     }
// //   };

// //   return (
// //     <AuthContext.Provider
// //       value={{ user, loading, login, loginWithOtp, sendOtp, register, verifyOtp, logout }}
// //     >
// //       {children}
// //     </AuthContext.Provider>
// //   );
// // };