import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const API_URL = 'http://localhost:5376';

  // Check if user is logged in on app load
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
              // Retry the request with the new token
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
      return { success: false, message: error.response?.data?.message || 'OTP verification failed' };
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
          // Retry the request with the new token
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

  // New: Send OTP for forgot password
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

  // New: Reset password with OTP
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

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
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
        addToCart
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