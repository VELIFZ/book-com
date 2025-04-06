import { 
  Container, 
  Paper, 
  Grid, 
  Typography, 
  Button, 
  Box,
  Divider,
  Chip,
  Snackbar,
  Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { getConditionColor, getConditionDescription } from '../utils/bookUtils';
import { useCart } from '../context/CartContext';
import '../styles/BookDetail.css';

// BookDetail react component
const BookDetail = ({ book }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  console.log('BookDetail received book:', book);

  if (!book) {
    return (
      <Container>
        <Paper className="book-detail-error" sx={{ p: 4, my: 4, textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom>Book not found</Typography>
          <Button 
            variant="contained" 
            onClick={() => navigate('/books')}
          >
            Back to Books
          </Button>
        </Paper>
      </Container>
    );
  }

  // Extract book properties with fallbacks for missing data
  // Handle different field names between frontend and backend
  const {
    title = 'Untitled Book',
    price = 0,
    description = 'No description available',
    condition = 'Good',
    author = 'Unknown Author',
    isbn = 'N/A',
    publisher = 'N/A',
    year = 'N/A',
    publication_year = 'N/A', // Backend field name
    pages = 'N/A',
    language = 'English',
    format = 'Paperback',
    imageUrl = '/placeholder-book.jpg',
    image_url = null // Backend field name
  } = book;

  // Use correct field based on availability (backend vs frontend)
  const bookImage = image_url || imageUrl;
  const publicationYear = publication_year || year;
  
  // Format price with 2 decimal places
  const formattedPrice = typeof price === 'number' ? price.toFixed(2) : '0.00';

  const handleAddToCart = () => {
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
    <Container className="book-detail-container">
      <Paper className="book-detail-paper" sx={{ p: 4, my: 4 }}>
        <Grid container spacing={4}>
          {/* Image Section */}
          <Grid item xs={12} md={4}>
            <img 
              src={bookImage || '/placeholder-book.jpg'} 
              alt={title}
              className="book-detail-image"
              style={{ width: '100%', maxHeight: '500px', objectFit: 'contain' }}
            />
          </Grid>

          {/* Content Section */}
          <Grid item xs={12} md={8}>
            <Box className="book-detail-content">
              <Typography variant="h4" className="book-detail-title" gutterBottom>
                {title}
              </Typography>
              
              <Box className="book-detail-header" sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Typography variant="h5" className="book-detail-price">
                  ${formattedPrice}
                </Typography>
                <Chip 
                  label={condition}
                  className="book-condition-chip"
                  style={{ 
                    backgroundColor: getConditionColor(condition),
                    color: '#fff'
                  }}
                />
              </Box>

              <Box className="book-condition-info" sx={{ mb: 2 }}>
                <Typography variant="body2">
                  {getConditionDescription(condition)}
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />
              
              <Typography variant="h6" gutterBottom>About this book</Typography>
              <Typography className="book-detail-description" paragraph>
                {description}
              </Typography>

              <Box className="book-detail-info" sx={{ my: 3 }}>
                <Typography paragraph><strong>Author:</strong> {author}</Typography>
                {isbn && <Typography paragraph><strong>ISBN:</strong> {isbn}</Typography>}
                {publisher && <Typography paragraph><strong>Publisher:</strong> {publisher}</Typography>}
                {publicationYear && <Typography paragraph><strong>Publication Year:</strong> {publicationYear}</Typography>}
                {pages && <Typography paragraph><strong>Pages:</strong> {pages}</Typography>}
                {language && <Typography paragraph><strong>Language:</strong> {language}</Typography>}
                {format && <Typography paragraph><strong>Format:</strong> {format}</Typography>}
              </Box>

              <Box className="book-detail-actions" sx={{ mt: 4, display: 'flex', gap: 2 }}>
                <Button 
                  variant="contained" 
                  color="primary"
                  size="large"
                  className="add-to-cart-button"
                  onClick={handleAddToCart}
                >
                  Add to Cart
                </Button>
                <Button 
                  variant="outlined"
                  onClick={() => navigate('/books')}
                  className="back-button"
                >
                  Back to Books
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="success">
          Book added to cart!
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default BookDetail;
