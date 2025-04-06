import { createContext, useState, useContext, useEffect } from 'react';
import { getCurrentUser, login, register, logout } from '../api/authApi';

// Create the authentication context
const AuthContext = createContext();

// Hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user on initial render
  useEffect(() => {
    console.log('AuthProvider: Loading user...');
    const loadUser = async () => {
      try {
        // Try to get the current user
        const user = await getCurrentUser();
        console.log('AuthProvider: User loaded:', user);
        setCurrentUser(user);
      } catch (err) {
        console.error('AuthProvider: Error loading user:', err);
        setError(err.message);
        // If there's an error, just set currentUser to null and continue
        setCurrentUser(null);
      } finally {
        console.log('AuthProvider: Setting loading to false');
        setLoading(false);
      }
    };

    // Check if we have a token first
    const token = localStorage.getItem('token');
    if (token) {
      loadUser();
    } else {
      console.log('AuthProvider: No token found, skipping user load');
      setLoading(false);
    }
  }, []);

  // Login function
  const userLogin = async (credentials) => {
    try {
      console.log('AuthProvider: Logging in user:', credentials.email);
      setLoading(true);
      setError(null);
      const response = await login(credentials);
      console.log('AuthProvider: Login successful:', response);
      setCurrentUser(response.user);
      return response;
    } catch (err) {
      console.error('AuthProvider: Login error:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const userRegister = async (userData) => {
    try {
      console.log('AuthProvider: Registering user:', userData.email);
      setLoading(true);
      setError(null);
      
      // Pass userData directly as received from Register component
      console.log('AuthProvider: Sending registration data:', userData);
      const response = await register(userData);
      console.log('AuthProvider: Registration successful:', response);
      setCurrentUser(response.user);
      return response;
    } catch (err) {
      console.error('AuthProvider: Registration error:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const userLogout = () => {
    console.log('AuthProvider: Logging out user');
    logout();
    setCurrentUser(null);
  };

  useEffect(() => {
    console.log('AuthProvider state:', { 
      currentUser, 
      loading, 
      error 
    });
  }, [currentUser, loading, error]);

  // Provide auth values and functions
  const value = {
    currentUser,
    loading,
    error,
    login: userLogin,
    register: userRegister,
    logout: userLogout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 