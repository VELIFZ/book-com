import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Books from './pages/Books';
import BookDetail from './pages/BookDetail';
import SellBook from './pages/SellBook';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import EditBook from './pages/EditBook';
import Sellers from './pages/Sellers';
import SellerDetail from './pages/SellerDetail';
import { useAuth } from './context/AuthContext';
import { CircularProgress, Box, Typography } from '@mui/material';

// Book detail wrapper to handle loading states and finding the book
const BookDetailWrapper = ({ books, loading, error }) => {
  return <BookDetail books={books} loading={loading} error={error} />;
};

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

const AppRoutes = (props) => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home {...props} />} />
      <Route path="/books" element={<Books {...props} />} />
      <Route path="/books/:id" element={<BookDetailWrapper {...props} />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/sellers" element={<Sellers />} />
      <Route path="/sellers/:id" element={<SellerDetail />} />
      
      {/* Protected Routes */}
      <Route 
        path="/sell" 
        element={
          <ProtectedRoute>
            <SellBook {...props} />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/edit/:id" 
        element={
          <ProtectedRoute>
            <EditBook {...props} />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute>
            <Profile {...props} />
          </ProtectedRoute>
        } 
      />
      
      {/* Not Found Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
