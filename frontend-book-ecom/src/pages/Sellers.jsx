import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Avatar,
  Box,
  Divider,
  CircularProgress,
  Alert,
  Chip
} from '@mui/material';
import { Link } from 'react-router-dom';
import StorefrontIcon from '@mui/icons-material/Storefront';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import axios from 'axios';

const API_URL = 'http://localhost:5000';

const Sellers = () => {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSellers = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch all books
        const response = await axios.get(`${API_URL}/books`);
        
        // Log the response to understand its structure
        console.log('Sellers API response:', response.data);
        
        // Check if the response is properly formatted
        let booksData = [];
        if (response.data && response.data.books && Array.isArray(response.data.books)) {
          booksData = response.data.books;
        } else if (Array.isArray(response.data)) {
          booksData = response.data;
        } else {
          console.error('Unexpected data format from API:', response.data);
          setError('Data format error. Please try again later.');
          return;
        }
        
        console.log('Fetched books:', booksData);
        
        if (!booksData || booksData.length === 0) {
          console.log('No books found in the database');
          setSellers([]);
          return;
        }
        
        // Process the real data to extract sellers
        const sellersMap = new Map();

        booksData.forEach(book => {
          // Get the seller ID from either user_id or seller_id field
          const sellerId = book.user_id || book.seller_id;
          
          if (sellerId) {
            if (!sellersMap.has(sellerId)) {
              sellersMap.set(sellerId, {
                id: sellerId,
                name: book.user_name || 'Unknown Seller',
                booksCount: 1,
                joinedDate: book.created_at || new Date().toISOString(),
                description: `Active book seller on BookStore`,
                avatar: (book.user_name || 'U')[0],
                email: book.user_email || ''
              });
            } else {
              const seller = sellersMap.get(sellerId);
              seller.booksCount += 1;
            }
          } else {
            console.log('Book without seller ID:', book);
          }
        });

        const sellersArray = Array.from(sellersMap.values())
          .sort((a, b) => b.booksCount - a.booksCount);
        
        console.log('Processed sellers:', sellersArray);
        setSellers(sellersArray);
      } catch (err) {
        console.error('Error fetching sellers:', err);
        setError('Failed to load sellers. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchSellers();
  }, []);

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

  // Show message if no sellers are found
  if (sellers.length === 0) {
    return (
      <Container sx={{ py: 4, textAlign: 'center' }}>
        <Alert severity="info" sx={{ mb: 4 }}>
          No sellers found. Be the first to sell books on our platform!
        </Alert>
        
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} md={6}>
            <Card sx={{ mb: 4 }}>
              <CardContent>
                <Typography variant="h5" component="h2" gutterBottom>
                  Start Selling Today
                </Typography>
                <Typography variant="body1" paragraph>
                  It looks like there are no sellers yet. Become the first seller and list your books!
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Selling on BookStore is easy:
                </Typography>
                <ol>
                  <li>Create an account or log in</li>
                  <li>Click the "Start Selling" button</li>
                  <li>Fill in details about your book</li>
                  <li>Upload a photo</li>
                  <li>Set your price</li>
                </ol>
              </CardContent>
              <CardActions>
                <Button
                  component={Link}
                  to="/login"
                  color="primary"
                  variant="contained"
                  fullWidth
                >
                  Get Started
                </Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Our Sellers
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Discover our trusted book sellers and their unique collections
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {sellers.map((seller) => (
          <Grid item xs={12} sm={6} md={4} key={seller.id}>
            <Card 
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                }
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar 
                    sx={{ 
                      width: 56, 
                      height: 56, 
                      bgcolor: 'primary.main',
                      mr: 2
                    }}
                  >
                    {seller.avatar}
                  </Avatar>
                  <Box>
                    <Typography variant="h6" gutterBottom sx={{ mb: 0 }}>
                      {seller.name}
                    </Typography>
                    {seller.email && (
                      <Typography variant="body2" color="text.secondary">
                        {seller.email}
                      </Typography>
                    )}
                  </Box>
                </Box>

                <Typography variant="body2" paragraph>
                  {seller.description}
                </Typography>

                <Divider sx={{ my: 2 }} />

                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <MenuBookIcon sx={{ color: 'primary.main', mr: 1 }} />
                      <Typography variant="body2">
                        {seller.booksCount} {seller.booksCount === 1 ? 'Book' : 'Books'} Listed
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>

                <Box sx={{ mt: 2 }}>
                  <Chip 
                    size="small" 
                    label={`Joined ${new Date(seller.joinedDate).toLocaleDateString()}`}
                    sx={{ bgcolor: 'background.default' }}
                  />
                </Box>
              </CardContent>

              <CardActions sx={{ p: 2, pt: 0 }}>
                <Button
                  component={Link}
                  to={`/sellers/${seller.id}`}
                  variant="contained"
                  fullWidth
                  startIcon={<StorefrontIcon />}
                >
                  View Books
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Sellers; 