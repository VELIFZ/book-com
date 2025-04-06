import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  TextField, 
  Button, 
  Grid, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Alert, 
  CircularProgress, 
  Paper,
  Tabs,
  Tab,
  Box,
  IconButton,
  Tooltip
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAuth } from '../context/AuthContext';
import { getBook, updateBook } from '../services/bookService';
import '../styles/EditBook.css';
import axios from 'axios';
import InfoIcon from '@mui/icons-material/Info';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import CloseIcon from '@mui/icons-material/Close';

// API URL - Make sure this matches your backend
const API_URL = 'http://localhost:5000';

// Book conditions and formats
const BOOK_CONDITIONS = [
  'New',
  'Like New',
  'Very Good',
  'Good',
  'Fair',
  'Poor'
];

const BOOK_FORMATS = [
  'Hardcover',
  'Paperback',
  'Mass Market Paperback',
  'E-book',
  'Audiobook',
  'Other'
];

const EditBook = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [imageTab, setImageTab] = useState(0); // 0 for URL, 1 for upload
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    price: '',
    description: '',
    format: '',
    image_url: '',
    isbn: '',
    year: '',
    publisher: '',
    language: '',
    pages: '',
    condition: ''
  });

  // Language options
  const languages = ['English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese', 'Other'];

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        
        // Debug the id parameter
        console.log('EditBook: ID parameter from URL:', id);
        console.log('EditBook: ID parameter type:', typeof id);
        
        // First try using the service
        try {
          const data = await getBook(id);
          console.log('Fetched book data successfully:', data);
          
          // Set image preview if there's an image URL
          if (data.image_url) {
            setImagePreview(data.image_url);
          }
          
          // Update form data with the fetched book
          setFormData({
            title: data.title || '',
            author: data.author || '',
            price: data.price ? data.price.toString() : '',
            description: data.description || '',
            format: data.format || '',
            image_url: data.image_url || '',
            isbn: data.isbn || '',
            year: data.year ? data.year.toString() : '',
            publisher: data.publisher || '',
            language: data.language || '',
            pages: data.pages ? data.pages.toString() : '',
            condition: data.condition || ''
          });
          
          setLoading(false);
        } catch (serviceError) {
          console.error('Error fetching using service:', serviceError);
          
          // Try direct fetch as a fallback
          console.log('Trying direct fetch as fallback');
          const response = await fetch(`http://localhost:5000/book/${id}`);
          
          if (!response.ok) {
            // Try alternative endpoint format
            console.log('First fallback failed, trying alternative endpoint');
            const alternativeResponse = await fetch(`http://localhost:5000/book/id/${id}`);
            
            if (!alternativeResponse.ok) {
              throw new Error(`Failed with status: ${response.status}`);
            }
            
            return await alternativeResponse.json();
          }
          
          return await response.json();
        }
      } catch (err) {
        console.error('Error fetching book:', err);
        setError(`Failed to load book details: ${err.message || 'Unknown error'}`);
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageTabChange = (event, newValue) => {
    setImageTab(newValue);
    
    // Display warning when user selects upload tab
    if (newValue === 1) {
      setError("Image upload feature is not fully implemented in the backend. Please use an image URL instead.");
    } else {
      setError(null);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) {
      return;
    }
    
    // Validate file type
    const fileType = file.type;
    const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validImageTypes.includes(fileType)) {
      setError('Please upload a valid image file (JPEG, PNG, GIF, WEBP)');
      return;
    }
    
    // Validate file size (5MB max)
    const fileSizeInMB = file.size / (1024 * 1024);
    if (fileSizeInMB > 5) {
      setError('Image file size must be less than 5MB');
      return;
    }
    
    // Set uploaded image and display warning
    setUploadedImage(file);
    setError("NOTE: Image upload functionality isn't fully implemented in the backend. The book will be updated but your image won't be saved. Please use an image URL instead.");
  };

  const clearUploadedImage = () => {
    setUploadedImage(null);
    setImagePreview(formData.image_url || ''); // Revert to original image if available
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.title || !formData.author || !formData.price) {
      setError('Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      console.log('Submitting book update with data:', formData);
      
      // Add the ID to the form data to make debugging easier
      const bookDataToSend = {
        ...formData,
        // Convert numeric fields to proper types
        price: parseFloat(formData.price),
        year: formData.year ? parseInt(formData.year) : null,
        pages: formData.pages ? parseInt(formData.pages) : null
      };
      
      console.log('Formatted data for update:', bookDataToSend);

      if (imageTab === 1 && uploadedImage) {
        console.log('Uploading new cover image with book data');
        
        const formDataObj = new FormData();
        formDataObj.append('cover', uploadedImage);
        
        // Add all other book data to the form
        Object.keys(bookDataToSend).forEach(key => {
          if (key !== 'id') { // Don't include id in the form data
            formDataObj.append(key, bookDataToSend[key]);
          }
        });
        
        const result = await updateBook(id, formDataObj, true);
        console.log('Book updated with new cover:', result);
        setSuccess(true);
        navigate(`/books/${id}`);
      } else {
        // No new image, just update the book data
        console.log('Updating book data without new cover');
        const { id: bookId, ...dataWithoutId } = bookDataToSend;
        const result = await updateBook(id, dataWithoutId);
        console.log('Book updated:', result);
        setSuccess(true);
        navigate(`/books/${id}`);
      }
    } catch (error) {
      console.error('Error updating book:', error);
      let errorMessage = 'Failed to update book.';
      
      if (error.response && error.response.data) {
        if (error.response.data.error) {
          errorMessage += ' ' + error.response.data.error;
        }
      } else if (error.message) {
        errorMessage += ' ' + error.message;
      }
      
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Container className="edit-book-container">
        <div className="loading-container">
          <CircularProgress size={60} />
          <Typography variant="h6" className="loading-text">
            Loading book details...
          </Typography>
        </div>
      </Container>
    );
  }

  return (
    <Container className="edit-book-container">
      <Paper elevation={3} className="edit-book-paper">
        <Typography variant="h4" component="h1" className="edit-book-title">
          Edit Book
        </Typography>
        
        <form onSubmit={handleSubmit} className="edit-book-form">
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                label="Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="form-field"
                disabled={submitting}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                label="Author"
                name="author"
                value={formData.author}
                onChange={handleChange}
                className="form-field"
                disabled={submitting}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                type="number"
                step="0.01"
                label="Price ($)"
                name="price"
                value={formData.price}
                onChange={handleChange}
                inputProps={{ min: 0, step: "0.01" }}
                className="form-field"
                disabled={submitting}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required className="form-field" disabled={submitting}>
                <InputLabel>Condition</InputLabel>
                <Select
                  name="condition"
                  value={formData.condition || ''}
                  onChange={handleChange}
                  label="Condition"
                >
                  {BOOK_CONDITIONS.map(condition => (
                    <MenuItem key={condition} value={condition}>{condition}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth required className="form-field" disabled={submitting}>
                <InputLabel>Format</InputLabel>
                <Select
                  name="format"
                  value={formData.format || ''}
                  onChange={handleChange}
                  label="Format"
                >
                  {BOOK_FORMATS.map(format => (
                    <MenuItem key={format} value={format}>{format}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="ISBN"
                name="isbn"
                value={formData.isbn || ''}
                onChange={handleChange}
                className="form-field"
                disabled={submitting}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Description"
                name="description"
                value={formData.description || ''}
                onChange={handleChange}
                className="form-field"
                disabled={submitting}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Book Cover Image
              </Typography>
              
              {imagePreview && (
                <div className="current-image-container">
                  <img 
                    src={imagePreview} 
                    alt="Current book cover" 
                    className="current-image-preview" 
                  />
                </div>
              )}
              
              {/* Image Input */}
              <Box sx={{ width: '100%', mt: 2 }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                  <Tabs 
                    value={imageTab} 
                    onChange={handleImageTabChange} 
                    aria-label="Book image options"
                  >
                    <Tab 
                      label="Image URL" 
                      value={0} 
                    />
                    <Tab 
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <span>Upload New Image</span>
                          <Tooltip title="Image upload is not fully supported yet">
                            <InfoIcon sx={{ ml: 1, fontSize: '0.9rem', color: 'warning.main' }} />
                          </Tooltip>
                        </Box>
                      } 
                      value={1} 
                    />
                  </Tabs>
                </Box>
                
                {/* Image URL input */}
                {imageTab === 0 && (
                  <Box sx={{ p: 2 }}>
                    <TextField
                      id="image-url"
                      label="Image URL"
                      fullWidth
                      name="image_url"
                      value={formData.image_url || ''}
                      onChange={handleChange}
                      placeholder="Enter direct image URL (max 255 characters)"
                      helperText="Use a direct image URL (right-click an image online and select 'Copy image address')"
                    />
                  </Box>
                )}
                
                {/* Image upload input */}
                {imageTab === 1 && (
                  <Box sx={{ p: 2 }}>
                    <div className="image-upload-container">
                      <Alert severity="warning" sx={{ mb: 2 }}>
                        Image upload feature is not fully implemented yet. Your book details will be updated, but the uploaded image will not be saved.
                        Please use the Image URL option instead.
                      </Alert>
                      <input
                        type="file"
                        id="book-image-upload"
                        onChange={handleImageUpload}
                        style={{ display: 'none' }}
                        accept=".jpg,.jpeg,.png,.gif,.webp"
                      />
                      <label htmlFor="book-image-upload" className="upload-button-label">
                        <Button
                          variant="contained"
                          component="span"
                          startIcon={<PhotoCamera />}
                          color="primary"
                          disabled={submitting}
                        >
                          Choose Image
                        </Button>
                      </label>
                      
                      {uploadedImage && (
                        <Box sx={{ mt: 2 }}>
                          <Box 
                            sx={{ 
                              position: 'relative',
                              width: 150,
                              height: 200,
                              mb: 1,
                              border: '1px solid #ccc'
                            }}
                          >
                            <img
                              src={URL.createObjectURL(uploadedImage)}
                              alt="Book preview"
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                            <IconButton
                              size="small"
                              onClick={clearUploadedImage}
                              sx={{ position: 'absolute', top: 5, right: 5, bgcolor: 'rgba(255,255,255,0.8)' }}
                            >
                              <CloseIcon fontSize="small" />
                            </IconButton>
                          </Box>
                          <Typography variant="caption" display="block">
                            {uploadedImage?.name} ({Math.round(uploadedImage?.size / 1024)} KB)
                          </Typography>
                          <Typography color="error" variant="caption">
                            Note: This image will not be saved due to backend limitations
                          </Typography>
                        </Box>
                      )}
                    </div>
                  </Box>
                )}
              </Box>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Publisher"
                name="publisher"
                value={formData.publisher || ''}
                onChange={handleChange}
                className="form-field"
                disabled={submitting}
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                type="number"
                label="Publication Year"
                name="year"
                value={formData.year || ''}
                onChange={handleChange}
                className="form-field"
                disabled={submitting}
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <FormControl fullWidth className="form-field" disabled={submitting}>
                <InputLabel>Language</InputLabel>
                <Select
                  name="language"
                  value={formData.language || ''}
                  onChange={handleChange}
                  label="Language"
                >
                  {languages.map(language => (
                    <MenuItem key={language} value={language}>{language}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                type="number"
                label="Pages"
                name="pages"
                value={formData.pages || ''}
                onChange={handleChange}
                inputProps={{ min: 1 }}
                className="form-field"
                disabled={submitting}
              />
            </Grid>
            
            <Grid item xs={12} className="edit-book-actions">
              <Button 
                variant="outlined" 
                color="secondary" 
                onClick={() => navigate(`/books/${id}`)}
                disabled={submitting}
                className="cancel-button"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                variant="contained" 
                color="primary" 
                disabled={submitting}
                className="save-button"
              >
                {submitting ? (
                  <div className="button-with-loader">
                    <CircularProgress size={24} className="button-loader" />
                    <span>Updating...</span>
                  </div>
                ) : (
                  'Update Book'
                )}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
      {error && (
        <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mt: 2, mb: 2 }}>
          Book updated successfully!
        </Alert>
      )}
    </Container>
  );
};

export default EditBook; 