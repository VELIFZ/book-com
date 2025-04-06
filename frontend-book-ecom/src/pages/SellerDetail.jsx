import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Avatar,
  Button,
  Divider,
  CircularProgress,
  Alert,
  Chip,
  Rating
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import StorefrontIcon from '@mui/icons-material/Storefront';
import StarIcon from '@mui/icons-material/Star';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import BookList from '../components/BookList';
import axios from 'axios';
import '../styles/SellerDetail.css';

const API_URL = 'http://localhost:5000';

const SellerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [seller, setSeller] = useState(null);
  const [sellerBooks, setSellerBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSellerDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log(`Attempting to fetch details for seller ID: ${id}`);
        
        // Fetch all books from API
        const response = await axios.get(`${API_URL}/books`);
        console.log('SellerDetail API response status:', response.status);
        console.log('SellerDetail API response data structure:', Object.keys(response.data));
        
        // Extract books from the response, handling different response formats
        let allBooks = [];
        if (response.data && response.data.books && Array.isArray(response.data.books)) {
          allBooks = response.data.books;
          console.log(`Found ${allBooks.length} books in response.data.books`);
        } else if (Array.isArray(response.data)) {
          allBooks = response.data;
          console.log(`Found ${allBooks.length} books in response.data array`);
        } else {
          console.error('Unexpected data format:', response.data);
          setError('Data format error. Please try again later.');
          return;
        }
        
        // Log some debug info about the first book if available
        if (allBooks.length > 0) {
          const sampleBook = allBooks[0];
          console.log('Sample book data:', {
            title: sampleBook.title,
            seller_id: sampleBook.seller_id,
            user_id: sampleBook.user_id,
            user_name: sampleBook.user_name
          });
        }
        
        // Filter books by the current seller ID, checking both user_id and seller_id fields
        const booksFromSeller = allBooks.filter(book => {
          // Check for matches in any seller-related field
          const bookSellerId = book.seller_id || book.user_id;
          
          // Convert both to strings for safer comparison
          const sellerId = id.toString();
          const bookSellerIdStr = bookSellerId ? bookSellerId.toString() : '';
          
          // Check if this book belongs to our target seller
          const match = bookSellerIdStr === sellerId;
          
          // Log details for debugging
          console.log(`Book "${book.title}" by ${book.author}: seller_id=${book.seller_id}, user_id=${book.user_id}, match=${match}`);
          
          return match;
        });
        
        console.log(`Found ${booksFromSeller.length} books from seller ID ${id}`);
        
        if (booksFromSeller.length > 0) {
          // Get seller info from the first book
          const firstBook = booksFromSeller[0];
          
          // Log all available seller-related fields for debugging
          console.log('Seller data fields in book:', {
            user_name: firstBook.user_name,
            user_email: firstBook.user_email,
            seller_id: firstBook.seller_id,
            user_id: firstBook.user_id,
            seller_name: firstBook.seller_name,
            owner: firstBook.owner,
            all_keys: Object.keys(firstBook)
          });
          
          // Get seller name from any available field
          const sellerName = firstBook.user_name || 
                            firstBook.seller_name || 
                            firstBook.owner || 
                            `Seller ${id}`;
          
          // Create a seller object using the information from the book
          const sellerInfo = {
            id: parseInt(id),
            name: sellerName,
            owner: sellerName,
            rating: firstBook.rating || 4.5, // Use actual rating if available
            booksCount: booksFromSeller.length,
            joinedDate: firstBook.created_at || new Date().toISOString(),
            description: `Book seller with ${booksFromSeller.length} books available on our platform.`,
            avatar: (sellerName || 'S')[0].toUpperCase(),
            email: firstBook.user_email || 'Not provided',
            phone: 'Not provided',
            location: firstBook.user_location || 'Not specified',
            specialties: ['Books'], // Default specialty
            totalSales: Math.floor(booksFromSeller.length * 2.5), // Estimate based on book count
            responseRate: '95%' // Default response rate
          };
          
          console.log('Created seller info:', sellerInfo);
          setSeller(sellerInfo);
          setSellerBooks(booksFromSeller);
        } else {
          console.log('No books found for seller ID:', id);
          setError('No books found for this seller');
        }
      } catch (err) {
        console.error('Error fetching seller details:', err);
        setError('Failed to load seller details');
      } finally {
        setLoading(false);
      }
    };

    fetchSellerDetails();
  }, [id]);

  if (loading) {
    return (
      <Container sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!seller) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="info">Seller not found</Alert>
      </Container>
    );
  }

  // Debug information about the seller
  console.log('Rendering seller details for:', {
    id: seller.id,
    name: seller.name,
    booksCount: sellerBooks.length,
    bookTitles: sellerBooks.map(book => book.title),
    firstBookSellerId: sellerBooks[0]?.seller_id,
    firstBookUserId: sellerBooks[0]?.user_id,
    firstBookUserName: sellerBooks[0]?.user_name
  });

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/sellers')}
        sx={{ mb: 3 }}
      >
        Back to Sellers
      </Button>

      <Paper elevation={3} sx={{ mb: 4 }}>
        <Box sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4} sx={{ textAlign: { xs: 'center', md: 'left' } }}>
              <Avatar
                sx={{
                  width: 120,
                  height: 120,
                  bgcolor: 'primary.main',
                  fontSize: '3rem',
                  margin: { xs: 'auto', md: '0' }
                }}
              >
                {seller.avatar}
              </Avatar>
            </Grid>
            
            <Grid item xs={12} md={8}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, justifyContent: { xs: 'center', md: 'flex-start' } }}>
                <Typography variant="h4" component="h1">
                  {seller.name}
                </Typography>
                <Chip
                  icon={<StorefrontIcon />}
                  label="Verified Seller"
                  color="primary"
                  sx={{ ml: 2 }}
                />
              </Box>

              <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                Owned by {seller.owner}
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, justifyContent: { xs: 'center', md: 'flex-start' } }}>
                <Rating value={seller.rating} precision={0.5} readOnly />
                <Typography variant="body2" color="text.secondary">
                  ({seller.rating} / 5.0)
                </Typography>
              </Box>

              <Typography variant="body1" paragraph>
                {seller.description}
              </Typography>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Box className="stat-box">
                <MenuBookIcon color="primary" />
                <Typography variant="h6">{seller.booksCount}</Typography>
                <Typography variant="body2" color="text.secondary">Books Listed</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box className="stat-box">
                <StarIcon color="primary" />
                <Typography variant="h6">{seller.totalSales}</Typography>
                <Typography variant="body2" color="text.secondary">Total Sales</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box className="stat-box">
                <Typography variant="h6">{seller.responseRate}</Typography>
                <Typography variant="body2" color="text.secondary">Response Rate</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box className="stat-box">
                <Typography variant="h6">{new Date(seller.joinedDate).toLocaleDateString()}</Typography>
                <Typography variant="body2" color="text.secondary">Member Since</Typography>
              </Box>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Box sx={{ mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              Specialties
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {seller.specialties.map((specialty, index) => (
                <Chip key={index} label={specialty} />
              ))}
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Email
              </Typography>
              <Typography>{seller.email}</Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Phone
              </Typography>
              <Typography>{seller.phone}</Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Location
              </Typography>
              <Typography>{seller.location}</Typography>
            </Box>
          </Box>
        </Box>
      </Paper>

      <Typography variant="h5" gutterBottom sx={{ mt: 4, mb: 3 }}>
        Books by {seller.name}
      </Typography>

      <BookList books={sellerBooks} />
    </Container>
  );
};

export default SellerDetail; 