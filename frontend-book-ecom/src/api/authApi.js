// Authentication API service for communicating with the backend

const API_URL = 'http://localhost:5000/auth';

// Register a new user
export const register = async (userData) => {
  try {
    console.log('API - Registering user with data:', userData);
    
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });
    
    // Get response text first for better error reporting
    const responseText = await response.text();
    console.log('API - Registration response text:', responseText);
    
    // Parse as JSON if possible
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      // If it's not valid JSON, use the text directly
      console.error('API - Failed to parse response as JSON:', e);
      throw new Error(`Error registering user: ${responseText || response.statusText}`);
    }
    
    if (!response.ok) {
      console.error('API - Registration failed:', data);
      throw new Error(data.message || `Error registering user: ${response.statusText}`);
    }
    
    // Store the token in local storage
    if (data.token) {
      localStorage.setItem('token', data.token);
    }
    
    return data;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};

// Login with existing credentials
export const login = async (credentials) => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    });
    
    if (!response.ok) {
      throw new Error(`Error logging in: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Store the token in local storage
    if (data.token) {
      localStorage.setItem('token', data.token);
    }
    
    return data;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

// Get current user information
export const getCurrentUser = async () => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      return null;
    }
    
    const response = await fetch(`${API_URL}/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        // Token is invalid or expired
        localStorage.removeItem('token');
        return null;
      }
      throw new Error(`Error getting current user: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error getting current user:', error);
    throw error;
  }
};

// Logout the user
export const logout = () => {
  localStorage.removeItem('token');
};

// Refresh JWT token
export const refreshToken = async () => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      return null;
    }
    
    const response = await fetch(`${API_URL}/refresh`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        // Token is invalid or expired
        localStorage.removeItem('token');
        return null;
      }
      throw new Error(`Error refreshing token: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Store the new token in local storage
    if (data.token) {
      localStorage.setItem('token', data.token);
    }
    
    return data;
  } catch (error) {
    console.error('Error refreshing token:', error);
    throw error;
  }
}; 