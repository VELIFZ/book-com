import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Grid,
  Snackbar,
  Tabs,
  Tab,
  Box,
  IconButton,
  Tooltip
} from '@mui/material'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import DeleteIcon from '@mui/icons-material/Delete'
import InfoIcon from '@mui/icons-material/Info'
import { createBook } from '../api/bookApi'
import { useAuth } from '../context/AuthContext'
import '../styles/SellBook.css'

const BOOK_CONDITIONS = [
  'New',
  'Like New',
  'Very Good',
  'Good',
  'Fair',
  'Poor'
]

const BOOK_FORMATS = [
  'Hardcover',
  'Paperback',
  'Mass Market Paperback',
  'E-book',
  'Audiobook',
  'Other'
]

const SellBook = ({ setBooks }) => {
  const { currentUser } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [imageTab, setImageTab] = useState(0) // 0 for URL, 1 for upload
  const [uploadedImage, setUploadedImage] = useState(null)
  const [imagePreview, setImagePreview] = useState('')
  const fileInputRef = useRef(null)
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    price: '',
    description: '',
    condition: '',
    isbn: '',
    publisher: '',
    year: '',
    pages: '',
    language: 'English',
    format: '',
    imageUrl: ''
  })
  const [formErrors, setFormErrors] = useState({})
  const [touched, setTouched] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    
    // Clear error when field is modified
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleImageTabChange = (event, newValue) => {
    setImageTab(newValue)
    
    // Clear the other image input type when switching tabs
    if (newValue === 0) {
      setUploadedImage(null)
      setImagePreview('')
    } else {
      setFormData(prev => ({
        ...prev,
        imageUrl: ''
      }))
      
      // Show warning about image upload
      setError("The image upload feature is not fully implemented in the backend. Please use an image URL instead.")
    }
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return
    
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if (!validTypes.includes(file.type)) {
      setFormErrors(prev => ({
        ...prev,
        uploadedImage: 'Please upload a valid image file (JPEG, PNG, GIF, WEBP)'
      }))
      return
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setFormErrors(prev => ({
        ...prev,
        uploadedImage: 'Image file size must be less than 5MB'
      }))
      return
    }
    
    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result)
    }
    reader.readAsDataURL(file)
    
    setUploadedImage(file)
    
    // Clear validation errors
    setFormErrors(prev => ({
      ...prev,
      uploadedImage: ''
    }))
    
    // Show warning about image upload feature
    setError("NOTE: Image upload functionality is not fully implemented. Your book will be created but the image won't be saved. Please use an image URL instead.")
  }

  const clearUploadedImage = () => {
    setUploadedImage(null)
    setImagePreview('')
    if (fileInputRef.current) {
      fileInputRef.current.value = null
    }
  }

  const handleBlur = (e) => {
    const { name } = e.target
    setTouched(prev => ({
      ...prev,
      [name]: true
    }))
    
    // Validate single field on blur
    validateField(name, formData[name])
  }
  
  const validateField = (name, value) => {
    let error = ''
    
    switch (name) {
      case 'title':
        if (!value.trim()) {
          error = 'Title is required'
        } else if (value.trim().length < 2) {
          error = 'Title must be at least 2 characters'
        }
        break
        
      case 'author':
        if (!value.trim()) {
          error = 'Author is required'
        } else if (value.trim().length < 2) {
          error = 'Author must be at least 2 characters'
        }
        break
        
      case 'price':
        if (!value) {
          error = 'Price is required'
        } else if (isNaN(value) || Number(value) <= 0) {
          error = 'Price must be a positive number'
        } else if (Number(value) > 1000) {
          error = 'Price cannot exceed $1,000'
        }
        break
        
      case 'description':
        if (!value.trim()) {
          error = 'Description is required'
        } else if (value.trim().length < 10) {
          error = 'Please provide a more detailed description (at least 10 characters)'
        } else if (value.trim().length > 2000) {
          error = 'Description cannot exceed 2000 characters'
        }
        break
        
      case 'condition':
        if (!value) {
          error = 'Condition is required'
        }
        break
        
      case 'isbn':
        if (value && !/^(?:\d{10}|\d{13})$/.test(value.replace(/-/g, ''))) {
          error = 'ISBN must be 10 or 13 digits'
        }
        break
        
      case 'year':
        if (value && (isNaN(value) || value < 1000 || value > new Date().getFullYear())) {
          error = 'Please enter a valid publication year'
        }
        break
        
      case 'pages':
        if (value && (isNaN(value) || Number(value) <= 0 || !Number.isInteger(Number(value)))) {
          error = 'Pages must be a positive integer'
        } else if (value && Number(value) > 10000) {
          error = 'Pages count seems too high'
        }
        break
        
      case 'format':
        if (!value) {
          error = 'Format is required'
        }
        break
        
      case 'imageUrl':
        if (imageTab === 0 && !value && !uploadedImage) {
          error = 'Please provide either an image URL or upload an image'
        } else if (value && !/^(https?:\/\/)/i.test(value)) {
          error = 'Please enter a valid URL starting with http:// or https://'
        }
        break
        
      default:
        break
    }
    
    setFormErrors(prev => ({
      ...prev,
      [name]: error
    }))
    
    return !error
  }

  const validateForm = () => {
    // Mark all fields as touched
    const allTouched = Object.keys(formData).reduce((acc, key) => {
      acc[key] = true
      return acc
    }, {})
    setTouched(allTouched)
    
    // Validate all fields
    let isValid = true
    const newErrors = {}
    
    Object.keys(formData).forEach(key => {
      const fieldIsValid = validateField(key, formData[key])
      if (!fieldIsValid) {
        isValid = false
        newErrors[key] = formErrors[key] // Keep the existing error message
      }
    })
    
    // Check if we have an image (either URL or uploaded file)
    if (imageTab === 0 && !formData.imageUrl && !uploadedImage) {
      newErrors.imageUrl = 'Please provide either an image URL or upload an image'
      isValid = false
    } else if (imageTab === 1 && !uploadedImage) {
      newErrors.uploadedImage = 'Please upload an image file'
      isValid = false
    }
    
    setFormErrors(newErrors)
    return isValid
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      // Scroll to the first error
      const firstErrorField = document.querySelector('.Mui-error')
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
      return
    }

    try {
      setLoading(true)
      setError('')
      
      // Always use the JSON approach - image upload is not working reliably
      const bookData = {
        title: formData.title,
        author: formData.author,
        price: parseFloat(formData.price),
        description: formData.description,
        condition: formData.condition,
        isbn: formData.isbn || null,
        publisher: formData.publisher || null,
        year: formData.year ? parseInt(formData.year) : null,
        pages: formData.pages ? parseInt(formData.pages) : null,
        language: formData.language || 'English',
        format: formData.format || null,  // Make sure format is preserved
        seller_id: currentUser?.id
      }
      
      // Add image URL if provided
      if (imageTab === 0 && formData.imageUrl) {
        // Check URL length to avoid database errors
        let imageUrl = formData.imageUrl.trim()
        
        // Extract direct URLs from Google redirects
        if (imageUrl.includes('google.com/url') && imageUrl.includes('&url=')) {
          try {
            const urlParam = new URL(imageUrl).searchParams.get('url')
            if (urlParam) {
              imageUrl = urlParam
            }
          } catch (e) {
            // Failed to parse Google URL, continue with original
          }
        }
        
        // Enforce max length for database compatibility
        const MAX_URL_LENGTH = 255 // Common VARCHAR limit
        if (imageUrl.length > MAX_URL_LENGTH) {
          imageUrl = imageUrl.substring(0, MAX_URL_LENGTH)
        }
        
        bookData.image_url = imageUrl
      } else if (imageTab === 1 && uploadedImage) {
        // If they tried to upload an image, show a warning
        setError("Warning: Image upload is not fully supported. Your book will be created without an image.")
      }
      
      // Use regular JSON approach
      const response = await createBook(bookData)
      
      // Update books list with the new book if available
      if (setBooks && response) {
        setBooks(prevBooks => [...prevBooks, response])
      }
      
      // Show success message
      setSuccess(true)
      
      // Navigate to the book detail page after a delay
      setTimeout(() => {
        if (response && response.id) {
          navigate(`/books/${response.id}`)
        } else {
          // If no specific book ID, navigate to all books
          navigate('/books')
        }
      }, 1500)
    } catch (err) {
      setError(err.message || 'Failed to create book. Please try again.')
      // Scroll to error message
      const errorAlert = document.querySelector('.error-alert')
      if (errorAlert) {
        errorAlert.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    } finally {
      setLoading(false)
    }
  }

  const handleCloseSuccess = () => {
    setSuccess(false)
  }

  return (
    <Container maxWidth="md" className="sell-book-container">
      <Typography
        component="h1"
        variant="h4"
        align="center"
        gutterBottom
        className="sell-book-title"
      >
        Sell Your Book
      </Typography>
      
      {error && (
        <Alert severity="error" className="error-alert">
          {error}
        </Alert>
      )}
      
      <Paper elevation={3} className="sell-book-paper">
        <form onSubmit={handleSubmit} className="sell-book-form">
          <div className="form-description">
            <Typography variant="body1" gutterBottom>
              Please provide accurate details about your book. Fields marked with * are required.
            </Typography>
          </div>
          
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                required
                label="Book Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                onBlur={handleBlur}
                fullWidth
                error={touched.title && !!formErrors.title}
                helperText={touched.title && formErrors.title}
                className="form-field"
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                required
                label="Author"
                name="author"
                value={formData.author}
                onChange={handleChange}
                onBlur={handleBlur}
                fullWidth
                error={touched.author && !!formErrors.author}
                helperText={touched.author && formErrors.author}
                className="form-field"
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                required
                label="Price ($)"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                onBlur={handleBlur}
                fullWidth
                inputProps={{ step: '0.01', min: '0' }}
                error={touched.price && !!formErrors.price}
                helperText={touched.price && formErrors.price}
                className="form-field"
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl 
                fullWidth 
                required 
                error={touched.condition && !!formErrors.condition}
                className="form-field"
              >
                <InputLabel>Condition</InputLabel>
                <Select
                  name="condition"
                  value={formData.condition}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  label="Condition"
                >
                  {BOOK_CONDITIONS.map((condition) => (
                    <MenuItem key={condition} value={condition}>
                      {condition}
                    </MenuItem>
                  ))}
                </Select>
                {touched.condition && formErrors.condition && (
                  <Typography variant="caption" color="error" className="select-error">
                    {formErrors.condition}
                  </Typography>
                )}
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                required
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                onBlur={handleBlur}
                fullWidth
                multiline
                rows={4}
                error={touched.description && !!formErrors.description}
                helperText={touched.description && formErrors.description}
                className="form-field"
              />
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Book Cover Image*
              </Typography>
              
              <Tabs 
                value={imageTab} 
                onChange={handleImageTabChange}
                className="image-tabs"
                indicatorColor="primary"
                textColor="primary"
              >
                <Tab label="Provide URL" />
                <Tab 
                  label={
                    <Box className="tab-label-with-icon">
                      <span>Upload Image</span>
                      <Tooltip title="Image upload is not fully supported yet">
                        <InfoIcon className="warning-icon" />
                      </Tooltip>
                    </Box>
                  } 
                />
              </Tabs>
              
              <Box className="image-input-container">
                {imageTab === 0 ? (
                  <TextField
                    label="Image URL"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    fullWidth
                    error={touched.imageUrl && !!formErrors.imageUrl}
                    helperText={touched.imageUrl && (formErrors.imageUrl || "URL to the book's cover image")}
                    className="form-field"
                    placeholder="https://example.com/book-cover.jpg"
                  />
                ) : (
                  <div className="image-upload-container">
                    <Alert severity="warning" sx={{ mb: 2 }}>
                      Image upload feature is not fully implemented yet. Your book details will be saved, but the uploaded image will not be stored.
                      Please use the Image URL option instead.
                    </Alert>
                    <input
                      type="file"
                      accept="image/*"
                      id="book-image-upload"
                      onChange={handleImageUpload}
                      ref={fileInputRef}
                      className="hidden-file-input"
                    />
                    <label htmlFor="book-image-upload" className="upload-button-label">
                      <Button
                        variant="outlined"
                        component="span"
                        startIcon={<CloudUploadIcon />}
                        className="upload-button"
                      >
                        Select Image File
                      </Button>
                    </label>
                    
                    {formErrors.uploadedImage && (
                      <Typography variant="caption" color="error" className="upload-error">
                        {formErrors.uploadedImage}
                      </Typography>
                    )}
                    
                    {imagePreview && (
                      <div className="image-preview-container">
                        <img 
                          src={imagePreview} 
                          alt="Book cover preview" 
                          className="image-preview" 
                        />
                        <IconButton 
                          className="delete-image-button"
                          onClick={clearUploadedImage}
                          size="small"
                        >
                          <DeleteIcon />
                        </IconButton>
                        <Typography variant="caption" className="file-name">
                          {uploadedImage?.name} ({Math.round(uploadedImage?.size / 1024)} KB)
                        </Typography>
                      </div>
                    )}
                  </div>
                )}
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl 
                fullWidth 
                required
                error={touched.format && !!formErrors.format}
                className="form-field"
              >
                <InputLabel>Format</InputLabel>
                <Select
                  name="format"
                  value={formData.format}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  label="Format"
                >
                  {BOOK_FORMATS.map((format) => (
                    <MenuItem key={format} value={format}>
                      {format}
                    </MenuItem>
                  ))}
                </Select>
                {touched.format && formErrors.format && (
                  <Typography variant="caption" color="error" className="select-error">
                    {formErrors.format}
                  </Typography>
                )}
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                label="ISBN"
                name="isbn"
                value={formData.isbn}
                onChange={handleChange}
                onBlur={handleBlur}
                fullWidth
                error={touched.isbn && !!formErrors.isbn}
                helperText={touched.isbn && formErrors.isbn}
                className="form-field"
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                label="Publisher"
                name="publisher"
                value={formData.publisher}
                onChange={handleChange}
                fullWidth
                className="form-field"
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                label="Publication Year"
                name="year"
                type="number"
                value={formData.year}
                onChange={handleChange}
                onBlur={handleBlur}
                fullWidth
                error={touched.year && !!formErrors.year}
                helperText={touched.year && formErrors.year}
                className="form-field"
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                label="Number of Pages"
                name="pages"
                type="number"
                value={formData.pages}
                onChange={handleChange}
                onBlur={handleBlur}
                fullWidth
                error={touched.pages && !!formErrors.pages}
                helperText={touched.pages && formErrors.pages}
                className="form-field"
              />
            </Grid>
            
            <Grid item xs={12} className="form-actions">
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => navigate(-1)}
                disabled={loading}
                className="cancel-button"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
                className="submit-button"
              >
                {loading ? (
                  <>
                    <CircularProgress size={24} className="button-progress" />
                    <span className="button-text">Submitting...</span>
                  </>
                ) : (
                  'List Book for Sale'
                )}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
      
      <Snackbar
        open={success}
        autoHideDuration={3000}
        onClose={handleCloseSuccess}
        message="Book listed successfully! Redirecting to book details page..."
        className="success-snackbar"
      />
    </Container>
  )
}

export default SellBook