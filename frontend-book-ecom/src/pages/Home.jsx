import { Container, Typography, Box, Button, CircularProgress, Alert, Paper } from '@mui/material'
import { Link } from 'react-router-dom'
import BookList from '../components/BookList'

const Home = ({ books, loading, error }) => {
  console.log('Home rendering with:', { booksCount: books.length, loading, error });
  
  // For demo purposes, we'll show first 2 books as featured
  const featuredBooks = books.slice(0, 2)

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: 8,
          mb: 6,
        }}
      >
        <Container maxWidth="lg">
          <Typography
            component="h1"
            variant="h2"
            align="center"
            gutterBottom
          >
            Welcome to BookStore
          </Typography>
          <Typography
            variant="h5"
            align="center"
            paragraph
          >
            Discover, Buy, and Sell Books with Ease
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
            <Button
              component={Link}
              to="/books"
              variant="contained"
              color="secondary"
              size="large"
            >
              Browse Books
            </Button>
            <Button
              component={Link}
              to="/sell"
              variant="outlined"
              color="inherit"
              size="large"
            >
              Sell Your Books
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Featured Books Section */}
      <Container maxWidth="lg">
        <Typography
          component="h2"
          variant="h4"
          align="center"
          gutterBottom
          sx={{ mb: 4 }}
        >
          Featured Books
        </Typography>
        
        {loading ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', my: 4 }}>
            <CircularProgress size={60} />
            <Typography variant="h6" sx={{ mt: 2 }}>
              Loading books from API...
            </Typography>
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ my: 4 }}>
            {error}
          </Alert>
        ) : books.length === 0 ? (
          <Paper elevation={3} sx={{ p: 4, my: 4, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              No books available at the moment
            </Typography>
            <Typography variant="body1" paragraph>
              API connection may be experiencing issues or no books exist in the database.
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Check your console for detailed error information.
            </Typography>
            <Button 
              variant="contained" 
              color="primary"
              onClick={() => window.location.reload()}
            >
              Retry Loading
            </Button>
          </Paper>
        ) : (
          <>
            <BookList books={featuredBooks} />
            <Box sx={{ mt: 4, p: 3, bgcolor: '#f5f5f5', borderRadius: 1 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Debug Info: {books.length} books loaded from API
              </Typography>
              <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                First book ID: {books[0]?.id || 'unknown'}, Title: {books[0]?.title || 'unknown'}
              </Typography>
            </Box>
          </>
        )}
        
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Button
            component={Link}
            to="/books"
            variant="contained"
            color="primary"
            size="large"
          >
            View All Books
          </Button>
        </Box>
      </Container>
    </Box>
  )
}

export default Home
