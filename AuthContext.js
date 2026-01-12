import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [favoriteCount, setFavoriteCount] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async () => {
    try {
      const response = await axios.get('/api/auth/profile');
      setUser(response.data.data);
      fetchFavorites();
    } catch (error) {
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
    } finally {
      setLoading(false);
    }
  };

  const fetchFavorites = async () => {
    try {
      const response = await axios.get('/api/users/me/favorites');
      setFavoriteCount(response.data.data.length);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  };

  const login = async (email, password) => {
    const response = await axios.post('/api/auth/login', { email, password });
    const { token, user } = response.data.data;
    
    localStorage.setItem('token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    setUser(user);
    await fetchFavorites();
    
    return response.data;
  };

  const register = async (userData) => {
    const response = await axios.post('/api/auth/register', userData);
    const { token, user } = response.data.data;
    
    localStorage.setItem('token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    setUser(user);
    
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    setFavoriteCount(0);
  };

  const updateFavorites = (count) => {
    setFavoriteCount(count);
  };

  const value = {
    user,
    loading,
    favoriteCount,
    login,
    register,
    logout,
    updateFavorites
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};