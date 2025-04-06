import { useParams, useNavigate } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Button, 
  Paper, 
  Grid, 
  Box, 
  Divider, 
  Chip,
  Snackbar,
  Alert,
  IconButton,
  Card,
  CardContent,
  Avatar,
  Rating,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { useState, useEffect } from 'react';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import PersonIcon from '@mui/icons-material/Person';
import StarIcon from '@mui/icons-material/Star';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { getBook } from '../services/bookService';

const BookDetail = ({ books }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { currentUser } = useAuth();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [sellerBooks, setSellerBooks] = useState([]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        setLoading(true);
        // First try to find the book in the books prop
        const bookFromProps = books.find((b) => b.id === parseInt(id));
        
        if (bookFromProps) {
          console.log('Book data from props:', bookFromProps);
          setBook(bookFromProps);
          // Check if current user is the book seller
          if (currentUser && bookFromProps.seller_id === currentUser.id) {
            setIsOwner(true);
          }
          
          // Find other books from the same seller
          const otherSellerBooks = books.filter(b => 
            b.seller_id === bookFromProps.seller_id && 
            b.id !== bookFromProps.id
          ).slice(0, 4); // Limit to 4 books
          
          setSellerBooks(otherSellerBooks);
        } else {
          // If not found in props, fetch from API
          const fetchedBook = await getBook(id);
          if (fetchedBook) {
            console.log('Book data from API:', fetchedBook);
            setBook(fetchedBook);
            // Check if current user is the book seller
            if (currentUser && fetchedBook.seller_id === currentUser.id) {
              setIsOwner(true);
            }
            
            // Find other books from the same seller
            const otherSellerBooks = books.filter(b => 
              b.seller_id === fetchedBook.seller_id && 
              b.id !== fetchedBook.id
            ).slice(0, 4); // Limit to 4 books
            
            setSellerBooks(otherSellerBooks);
          } else {
            setError('Book not found');
          }
        }
      } catch (err) {
        console.error('Error fetching book details:', err);
        setError('Failed to load book details');
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [id, books, currentUser]);

  const handleAddToCart = () => {
    if (book) {
      addToCart(book);
      setSnackbarOpen(true);
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleEditBook = () => {
    navigate(`/edit/${id}`);
  };

  const handleViewSellerProfile = () => {
    if (book && book.seller_id) {
      navigate(`/sellers/${book.seller_id}`);
    }
  };

  const handleBookClick = (bookId) => {
    navigate(`/books/${bookId}`);
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h5">Loading book details...</Typography>
      </Container>
    );
  }

  if (error || !book) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom>{error || 'Book not found'}</Typography>
          <Button 
            variant="contained" 
            onClick={() => navigate('/books')}
            startIcon={<ArrowBackIcon />}
          >
            Back to Books
          </Button>
        </Paper>
      </Container>
    );
  }

  // Extract book properties with fallbacks
  const {
    title = 'Untitled Book',
    price = 0,
    description = 'No description available',
    author = 'Unknown Author',
    condition = 'Good',
    format = 'Paperback',
    year = 'N/A',
    publication_year = 'N/A',
    publisher = 'N/A',
    pages = 'N/A',
    isbn = 'N/A',
    language = 'English',
    imageUrl = '/placeholder-book.jpg',
    image_url = null,
    seller_id,
    user_name,
    user_email,
    rating
  } = book;

  // Use correct fields based on availability
  const bookImage = image_url || imageUrl;
  const publicationYear = publication_year || year;
  const sellerName = user_name || 'Seller'; // Fallback for seller name
  
  // Format price with 2 decimal places
  const formattedPrice = typeof price === 'number' ? price.toFixed(2) : '0.00';

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Breadcrumb-style navigation */}
      <Box sx={{ display: 'flex', mb: 3 }}>
        <Button 
          onClick={() => navigate('/books')}
          sx={{ fontWeight: 'normal', color: 'text.secondary', textTransform: 'none' }}
        >
          Books
        </Button>
        <Typography sx={{ mx: 1, color: 'text.secondary' }}>/</Typography>
        {author && (
          <>
            <Button 
              onClick={() => navigate(`/books?author=${encodeURIComponent(author)}`)}
              sx={{ fontWeight: 'normal', color: 'text.secondary', textTransform: 'none' }}
            >
              {author}
            </Button>
            <Typography sx={{ mx: 1, color: 'text.secondary' }}>/</Typography>
          </>
        )}
        <Typography color="text.primary">{title}</Typography>
      </Box>
      
      {/* Main content area with enlarged image */}
      <Paper sx={{ p: { xs: 2, md: 4 }, mb: 4, boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
        <Grid container spacing={4}>
          {/* Book Image - Enlarged */}
          <Grid item xs={12} md={5} lg={4} sx={{ display: 'flex', justifyContent: 'center' }}>
            <Box 
              sx={{
                position: 'relative',
                width: '100%',
                maxWidth: '350px',
                height: { xs: '300px', md: '450px' },
                mb: 2
              }}
            >
              <Box 
                component="img"
                src={bookImage || '/placeholder-book.jpg'}
                alt={title}
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  borderRadius: 1,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                }}
              />
              
              {/* Condition badge */}
              {condition && (
                <Chip 
                  label={condition}
                  color={
                    condition === 'New' ? 'success' :
                    condition === 'Like New' ? 'primary' :
                    condition === 'Good' ? 'info' :
                    condition === 'Fair' ? 'warning' : 'default'
                  }
                  size="small"
                  sx={{ 
                    position: 'absolute', 
                    top: 10, 
                    right: 10,
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                  }}
                />
              )}
            </Box>
          </Grid>
          
          {/* Book Details */}
          <Grid item xs={12} md={7} lg={8}>
            <Typography 
              variant="h4" 
              component="h1" 
              gutterBottom
              sx={{ 
                fontWeight: 500,
                fontSize: { xs: '1.5rem', md: '2rem' }
              }}
            >
              {title}
            </Typography>
            
            <Typography 
              variant="subtitle1" 
              sx={{ 
                mb: 2,
                color: 'text.secondary',
                fontSize: '1.1rem'
              }}
            >
              by <Typography component="span" color="primary" sx={{ fontWeight: 500 }}>{author}</Typography>
            </Typography>
            
            {/* Price section with improved styling */}
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                mb: 3, 
                p: 2,
                bgcolor: 'background.paper',
                borderRadius: 1,
                border: '1px solid',
                borderColor: 'divider'
              }}
            >
              <Typography 
                variant="h4" 
                color="primary" 
                fontWeight="bold"
                sx={{ mr: 2 }}
              >
                ${formattedPrice}
              </Typography>
              
              <Box sx={{ ml: 'auto' }}>
                {!isOwner && (
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    startIcon={<ShoppingCartIcon />}
                    onClick={handleAddToCart}
                    sx={{ 
                      fontWeight: 'bold',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                    }}
                  >
                    Add to Cart
                  </Button>
                )}
                {isOwner && (
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    startIcon={<EditIcon />}
                    onClick={handleEditBook}
                    sx={{ fontWeight: 'bold' }}
                  >
                    Edit Book
                  </Button>
                )}
              </Box>
            </Box>
            
            {/* Seller information card - Barnes & Noble style */}
            {!isOwner && seller_id && (
              <Paper
                elevation={0}
                sx={{ 
                  p: 2, 
                  mb: 3, 
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 1,
                  bgcolor: '#f9f9f9'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar 
                    sx={{ 
                      bgcolor: 'primary.main', 
                      width: 40, 
                      height: 40,
                      mr: 2
                    }}
                  >
                    <PersonIcon />
                  </Avatar>
                  
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {sellerName}
                    </Typography>
                    {rating && (
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Rating 
                          value={typeof rating === 'number' ? rating : 4.5} 
                          precision={0.5} 
                          size="small"
                          readOnly 
                        />
                        <Typography variant="body2" sx={{ ml: 1 }}>
                          {typeof rating === 'number' ? rating.toFixed(1) : "4.5"}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                  
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={handleViewSellerProfile}
                    sx={{ ml: 'auto' }}
                  >
                    View Seller
                  </Button>
                </Box>
                
                <Box 
                  sx={{ 
                    display: 'flex', 
                    mt: 2,
                    flexWrap: 'wrap',
                    gap: 2
                  }}
                >
                  <Chip 
                    icon={<LocalShippingIcon />} 
                    label="Standard Shipping" 
                    variant="outlined" 
                    size="small"
                  />
                  <Chip 
                    icon={<BookmarkIcon />} 
                    label={`${format}`} 
                    variant="outlined" 
                    size="small"
                  />
                </Box>
              </Paper>
            )}
            
            {/* Description section */}
            <Typography variant="h6" gutterBottom>
              Description
            </Typography>
            <Typography 
              variant="body1" 
              paragraph
              sx={{ 
                lineHeight: 1.8,
                color: 'text.secondary',
                whiteSpace: 'pre-line' // Preserve line breaks
              }}
            >
              {description}
            </Typography>
            
            {/* Book details section */}
            <Paper 
              elevation={0}
              sx={{ 
                p: 3, 
                mt: 3, 
                bgcolor: '#f9f9f9',
                borderRadius: 1
              }}
            >
              <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                Product Details
              </Typography>
              
              <Grid container spacing={2}>
                {format && (
                  <Grid item xs={6} md={4}>
                    <Typography variant="subtitle2" color="text.secondary">Format</Typography>
                    <Typography variant="body1">{format}</Typography>
                  </Grid>
                )}
                {publicationYear && (
                  <Grid item xs={6} md={4}>
                    <Typography variant="subtitle2" color="text.secondary">Publication Year</Typography>
                    <Typography variant="body1">{publicationYear}</Typography>
                  </Grid>
                )}
                {publisher && (
                  <Grid item xs={6} md={4}>
                    <Typography variant="subtitle2" color="text.secondary">Publisher</Typography>
                    <Typography variant="body1">{publisher}</Typography>
                  </Grid>
                )}
                {pages && (
                  <Grid item xs={6} md={4}>
                    <Typography variant="subtitle2" color="text.secondary">Pages</Typography>
                    <Typography variant="body1">{pages}</Typography>
                  </Grid>
                )}
                {isbn && (
                  <Grid item xs={6} md={4}>
                    <Typography variant="subtitle2" color="text.secondary">ISBN</Typography>
                    <Typography variant="body1">{isbn}</Typography>
                  </Grid>
                )}
                {language && (
                  <Grid item xs={6} md={4}>
                    <Typography variant="subtitle2" color="text.secondary">Language</Typography>
                    <Typography variant="body1">{language}</Typography>
                  </Grid>
                )}
              </Grid>
            </Paper>
            
            {/* Different action buttons based on user role - Only for mobile */}
            {isMobile && (
              <Box sx={{ display: 'flex', gap: 2, mt: 3, flexDirection: 'column' }}>
                {isOwner ? (
                  /* Owner actions */
                  <>
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      startIcon={<EditIcon />}
                      onClick={handleEditBook}
                    >
                      Edit Book
                    </Button>
                    <Button
                      variant="outlined"
                      fullWidth
                      onClick={() => navigate('/profile')}
                    >
                      Back to My Books
                    </Button>
                  </>
                ) : (
                  /* Shopper actions */
                  <>
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      startIcon={<ShoppingCartIcon />}
                      onClick={handleAddToCart}
                    >
                      Add to Cart
                    </Button>
                    <Button
                      variant="outlined"
                      fullWidth
                      onClick={() => navigate('/books')}
                    >
                      Continue Shopping
                    </Button>
                  </>
                )}
              </Box>
            )}
          </Grid>
        </Grid>
      </Paper>
      
      {/* Also from this seller section */}
      {!isOwner && sellerBooks.length > 0 && (
        <Box sx={{ mt: 6, mb: 4 }}>
          <Typography 
            variant="h5" 
            component="h2" 
            gutterBottom
            sx={{ 
              borderBottom: '2px solid',
              borderColor: 'primary.main',
              pb: 1,
              display: 'inline-block',
              fontWeight: 500
            }}
          >
            Also from this seller
          </Typography>
          
          <Grid container spacing={3} sx={{ mt: 2 }}>
            {sellerBooks.map(book => (
              <Grid item xs={6} sm={4} md={3} key={book.id}>
                <Paper 
                  elevation={2}
                  sx={{ 
                    height: '100%', 
                    transition: 'all 0.3s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                    },
                    cursor: 'pointer'
                  }}
                  onClick={() => handleBookClick(book.id)}
                >
                  <Box sx={{ position: 'relative', pt: '120%' }}>
                    <Box
                      component="img"
                      src={book.image_url || '/placeholder-book.jpg'}
                      alt={book.title}
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  </Box>
                  <Box sx={{ p: 2 }}>
                    <Typography 
                      variant="body1" 
                      fontWeight="medium" 
                      sx={{ 
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        height: '2.8em'
                      }}
                    >
                      {book.title}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      noWrap
                    >
                      {book.author}
                    </Typography>
                    <Typography 
                      variant="subtitle1" 
                      color="primary" 
                      fontWeight="bold"
                      sx={{ mt: 1 }}
                    >
                      ${typeof book.price === 'number' ? book.price.toFixed(2) : '0.00'}
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <Button 
              variant="outlined" 
              onClick={handleViewSellerProfile}
              sx={{ fontWeight: 500 }}
            >
              View All Books From This Seller
            </Button>
          </Box>
        </Box>
      )}
      
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity="success" 
          variant="filled"
          sx={{ width: '100%' }}
        >
          Added to cart!
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default BookDetail;
