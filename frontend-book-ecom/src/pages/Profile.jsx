import { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Button, 
  Tabs, 
  Tab, 
  CircularProgress,
  Grid,
  Card,
  CardContent,
  Avatar,
  Divider,
  CardMedia,
  CardActions,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Snackbar,
  Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useAuth } from '../context/AuthContext';
import { getAllBooks } from '../api/bookApi';
import { deleteBook } from '../services/bookService';
import '../styles/Profile.css';

// Tab panel component
const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box className="tab-panel-content">
          {children}
        </Box>
      )}
    </div>
  );
};

const Profile = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [userBooks, setUserBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [isDeleting, setIsDeleting] = useState(false);
  const [constraintErrorOpen, setConstraintErrorOpen] = useState(false);
  const [constraintErrorBook, setConstraintErrorBook] = useState(null);

  useEffect(() => {
    const fetchUserBooks = async () => {
      if (!currentUser) return;
      
      try {
        setLoading(true);
        const booksData = await getAllBooks();
        // Filter books that belong to the current user
        const userBooksData = booksData.filter(book => book.seller_id === currentUser.id);
        setUserBooks(userBooksData);
      } catch (err) {
        console.error('Error fetching user books:', err);
        setError('Failed to load your books. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserBooks();
  }, [currentUser]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleLogout = () => {
    logout();
  };

  const handleViewBookDetails = (bookId) => {
    navigate(`/books/${bookId}`);
  };

  const handleEditBook = (bookId) => {
    console.log(`Navigating to edit book with ID: ${bookId}`);
    navigate(`/edit/${bookId}`);
  };

  const handleDeleteClick = (book) => {
    setBookToDelete(book);
    setDeleteDialogOpen(true);
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
    setBookToDelete(null);
  };

  const handleDeleteConfirm = async () => {
    try {
      setIsDeleting(true);
      console.log(`Attempting to delete book with ID: ${bookToDelete.id}`);
      
      const response = await deleteBook(bookToDelete.id);
      console.log('Delete response:', response);
      
      // Remove the deleted book from the user's books list
      setUserBooks(userBooks.filter(book => book.id !== bookToDelete.id));
      setSnackbar({
        open: true,
        message: 'Book deleted successfully',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error deleting book:', error);
      
      // Check for foreign key constraint error
      if (error.response && error.response.data && error.response.data.error) {
        const errorText = error.response.data.error;
        
        if (errorText.includes('foreign key constraint fails') || 
            errorText.includes('IntegrityError')) {
          // Show special constraint error dialog instead of a snackbar
          setConstraintErrorBook(bookToDelete);
          setConstraintErrorOpen(true);
        } else {
          // For other errors, show snackbar
          setSnackbar({
            open: true,
            message: `Failed to delete book: ${error.response.data.error || error.message}`,
            severity: 'error'
          });
        }
      } else {
        setSnackbar({
          open: true,
          message: 'Failed to delete book. Please try again.',
          severity: 'error'
        });
      }
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setBookToDelete(null);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar(prev => ({
      ...prev,
      open: false
    }));
  };

  if (!currentUser) {
    return (
      <Container maxWidth="md">
        <div className="loading-container">
          <CircularProgress />
        </div>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" className="profile-container">
      <Paper elevation={3} className="profile-paper">
        <div className="profile-header">
          <Typography variant="h4" component="h1">
            Profile
          </Typography>
          <Button 
            variant="outlined" 
            color="secondary" 
            onClick={handleLogout}
            className="logout-button"
          >
            Logout
          </Button>
        </div>

        <div className="user-info-section">
          <Grid container spacing={3}>
            <Grid item xs={12} md={4} className="avatar-container">
              <Avatar 
                className="user-avatar"
              >
                {currentUser.first_name ? currentUser.first_name[0] : ''}
                {currentUser.last_name ? currentUser.last_name[0] : ''}
              </Avatar>
            </Grid>
            <Grid item xs={12} md={8}>
              <Typography variant="h5" gutterBottom>
                {currentUser.first_name} {currentUser.last_name}
              </Typography>
              <Typography variant="body1" color="text.secondary" gutterBottom>
                {currentUser.email}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Member since: {new Date(currentUser.created_at || Date.now()).toLocaleDateString()}
              </Typography>
            </Grid>
          </Grid>
        </div>

        <Divider className="section-divider" />

        <div className="tabs-container">
          <Box className="tabs-header">
            <Tabs value={tabValue} onChange={handleTabChange} aria-label="profile tabs">
              <Tab label="My Books" id="profile-tab-0" />
              <Tab label="Orders" id="profile-tab-1" />
              <Tab label="Settings" id="profile-tab-2" />
            </Tabs>
          </Box>
          
          <TabPanel value={tabValue} index={0}>
            {loading ? (
              <div className="loading-container">
                <CircularProgress />
              </div>
            ) : error ? (
              <Typography color="error">{error}</Typography>
            ) : userBooks.length > 0 ? (
              <Grid container spacing={3}>
                {userBooks.map((book) => (
                  <Grid item xs={12} sm={6} md={4} key={book.id}>
                    <Card className="book-card">
                      {book.image_url && (
                        <CardMedia
                          component="img"
                          height="140"
                          image={book.image_url}
                          alt={book.title}
                          className="book-image"
                        />
                      )}
                      <CardContent>
                        <Typography variant="h6" gutterBottom noWrap className="book-title">
                          {book.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Price: ${book.price}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Condition: {book.condition}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Status: {book.status || 'Available'}
                        </Typography>
                      </CardContent>
                      <CardActions className="card-actions">
                        <IconButton 
                          aria-label="view book details" 
                          onClick={() => handleViewBookDetails(book.id)}
                          title="View Details"
                        >
                          <VisibilityIcon />
                        </IconButton>
                        <IconButton 
                          aria-label="edit book" 
                          onClick={() => handleEditBook(book.id)}
                          title="Edit Book"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton 
                          aria-label="delete book" 
                          onClick={() => handleDeleteClick(book)}
                          title="Delete Book"
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <div className="empty-books-container">
                <Typography>
                  You haven't listed any books yet.
                </Typography>
                <Button 
                  variant="contained" 
                  color="primary" 
                  onClick={() => navigate('/sell')}
                  className="sell-book-button"
                >
                  Sell a Book
                </Button>
              </div>
            )}
          </TabPanel>
          
          <TabPanel value={tabValue} index={1}>
            <Typography>Your orders will appear here.</Typography>
          </TabPanel>
          
          <TabPanel value={tabValue} index={2}>
            <Typography>Account settings will appear here.</Typography>
          </TabPanel>
        </div>
      </Paper>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteDialogClose}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">
          Delete Book
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete "{bookToDelete?.title}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Constraint Error Dialog */}
      <Dialog
        open={constraintErrorOpen}
        onClose={() => setConstraintErrorOpen(false)}
      >
        <DialogTitle>
          <Typography variant="h6" color="error">
            Cannot Delete Book
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            The book "{constraintErrorBook?.title}" cannot be deleted because it has associated reviews or orders.
          </Typography>
          <Typography variant="body2" color="textSecondary">
            To delete this book, you need to first remove all reviews and ensure it's not part of any active orders.
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
            If you need assistance, please contact customer support.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setConstraintErrorOpen(false)} 
            color="primary" 
            variant="contained"
          >
            Understood
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={5000} 
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbar.severity}
          elevation={6} 
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Profile; 