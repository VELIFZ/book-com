// Displays a single book item

import { Card, CardContent, CardMedia, Typography, Button, Box, IconButton, Snackbar, Alert } from '@mui/material'
import { Link } from 'react-router-dom'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import { useState } from 'react'
import { useCart } from '../context/CartContext'
import '../styles/BookItem.css'

// receives book as a prop from BookList.jsx
const BookItem = ({ book }) => {
  const { addToCart } = useCart();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  
  // Handle missing book object
  if (!book) {
    console.error('BookItem received null or undefined book');
    return null;
  }
  
  // Log the entire book object for debugging
  console.log('BookItem original book object:', book);
  
  // Add default values for properties that might be missing
  const {
    id = '',
    title = 'Untitled Book',
    price = 0,
    description = 'No description available',
    imageUrl = '/placeholder-book.jpg',
    image_url
  } = book;
  
  // Use image_url if available (from backend) or imageUrl (from frontend mock data)
  const bookImage = image_url || imageUrl;
  
  // Format price with 2 decimal places
  const formattedPrice = typeof price === 'number' ? price.toFixed(2) : '0.00';
  
  console.log('BookItem rendering:', { id, title, formattedPrice, imageSource: bookImage });
  
  const handleAddToCart = (e) => {
    e.preventDefault(); // Prevent navigating to book detail page
    e.stopPropagation(); // Prevent event bubbling
    addToCart(book);
    setSnackbarOpen(true);
  };
  
  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };
  
  return (
    <>
      <Card className="book-item">
        {/* Image Section */}
        <CardMedia
          component="img"
          className="book-image"
          image={bookImage || '/placeholder-book.jpg'}
          alt={title}
        />
        
        {/* Content Section */}
        <CardContent className="book-content">
          <Typography variant="h6" className="book-title">
            {title}
          </Typography>
          <Typography variant="body1" className="book-price">
            ${formattedPrice}
          </Typography>
          <Typography variant="body2" className="book-description" sx={{ mb: 2 }}>
            {description.length > 100 ? `${description.substring(0, 100)}...` : description}
          </Typography>
          
          <Box className="book-actions">
            <Button
              component={Link}
              to={`/books/${id}`}
              className="view-details-button"
              variant="contained"
              size="small"
            >
              View Details
            </Button>
            <IconButton 
              color="primary" 
              className="add-to-cart-button"
              onClick={handleAddToCart}
              aria-label="Add to cart"
            >
              <ShoppingCartIcon />
            </IconButton>
          </Box>
        </CardContent>
      </Card>
      
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" variant="filled">
          Added to cart!
        </Alert>
      </Snackbar>
    </>
  )
}

export default BookItem 