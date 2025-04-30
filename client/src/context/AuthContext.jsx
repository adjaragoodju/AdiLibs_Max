// client/src/context/AuthContext.jsx
import { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const API_URL = 'http://localhost:3001/api'; // You would replace this with your real API URL

  useEffect(() => {
    // Check if user is logged in on page load
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }

    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      // Demo login for testing without backend
      if (email === 'demo@adilibs.com' && password === 'demo123') {
        const demoUser = {
          id: '1',
          username: 'Demo User',
          email: 'demo@adilibs.com',
          profileImage: '/placeholder-avatar.jpg.avif',
        };

        const demoToken = 'demo-token-123456';

        localStorage.setItem('token', demoToken);
        localStorage.setItem('user', JSON.stringify(demoUser));

        setUser(demoUser);
        return { success: true };
      }

      // Try API login if not using demo account
      try {
        const response = await axios.post(`${API_URL}/auth/login`, {
          email,
          password,
        });
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        setUser(response.data.user);
        return { success: true };
      } catch (apiError) {
        console.error('API Login error:', apiError);
        // If server is down or CORS issue, show a specific error
        if (!apiError.response || apiError.response.status === 0) {
          return {
            success: false,
            message: 'Server connection error. Please try again later.',
          };
        }
        return {
          success: false,
          message: apiError.response?.data?.message || 'Invalid credentials',
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: 'An error occurred during login',
      };
    }
  };

  const register = async (username, email, password) => {
    try {
      console.log('Attempting registration with:', {
        username,
        email,
        password: '***',
      });

      try {
        console.log('Making API request to:', `${API_URL}/auth/register`);
        const response = await axios.post(
          `${API_URL}/auth/register`,
          {
            username,
            email,
            password,
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
            withCredentials: true,
          }
        );

        console.log('Registration response:', response.data);
        return {
          success: true,
          message:
            response.data.message || 'Registration successful! Please log in.',
        };
      } catch (apiError) {
        console.error('API Registration error:', apiError);

        // Detailed error logging
        if (apiError.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.error('Error response data:', apiError.response.data);
          console.error('Error response status:', apiError.response.status);
          console.error('Error response headers:', apiError.response.headers);
        } else if (apiError.request) {
          // The request was made but no response was received
          console.error('No response received:', apiError.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error('Error during request setup:', apiError.message);
        }

        return {
          success: false,
          message: apiError.response?.data?.message || 'Registration failed',
        };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        message: 'An unexpected error occurred',
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  // Update user profile
  const updateProfile = async (userData) => {
    try {
      // In a real app, this would call your API
      if (user) {
        const updatedUser = { ...user, ...userData };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        return { success: true };
      }
      return { success: false, message: 'User not authenticated' };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update profile',
      };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateProfile,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
