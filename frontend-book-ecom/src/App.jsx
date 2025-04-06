// Main App component that sets up the theme, routes, and book data.
// The root component that manages state and renders everything.

import { useState, useEffect } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { ThemeProvider, CssBaseline } from '@mui/material'
import theme from './theme'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import AppRoutes from './routes'
import './styles/global.css'
import { getAllBooks } from './api/bookApi'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'

function App() {
  // State management for book data
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch books when component mounts
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        console.log('App: Starting to fetch books');
        setLoading(true);
        
        const booksData = await getAllBooks();
        
        if (booksData && Array.isArray(booksData)) {
          console.log('App: Books fetched successfully:', booksData.length);
          setBooks(booksData);
        } else {
          console.error('App: Unexpected data format:', booksData);
          setError('Books data is in an unexpected format');
        }
      } catch (err) {
        console.error('App: Error fetching books:', err);
        setError('Failed to load books. Please try again later.');
      } finally {
        setLoading(false);
        console.log('App: Loading complete');
      }
    };

    fetchBooks();
  }, []);

  useEffect(() => {
    console.log('App state updated:', { 
      booksCount: books.length, 
      loading, 
      error 
    });
  }, [books, loading, error]);

  // passing data as props
  const routeProps = {
    books,
    setBooks,
    loading,
    error
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <CartProvider>
          {/* setting up router*/}
          <Router>
            <div className="app">
              <Navbar />
              <main className="main-content">
                {/* handles navigation */}
                <AppRoutes {...routeProps} />
              </main>
              <Footer />
            </div>
          </Router>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App 