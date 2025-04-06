//Page listing all books.

import { useState, useEffect } from 'react'
import { Container, Typography, TextField, Grid, FormControl, InputLabel, Select, MenuItem, Button, CircularProgress, Alert } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import { useLocation, useNavigate } from 'react-router-dom'
import BookList from '../components/BookList'
import '../styles/Books.css'

const Books = ({ books, loading, error }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [priceRange, setPriceRange] = useState('all')
  const [sortBy, setSortBy] = useState('default')
  
  // Parse URL query parameters when component mounts or URL changes
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search)
    const query = searchParams.get('search')
    const category = searchParams.get('category')
    const price = searchParams.get('price')
    const sort = searchParams.get('sort')
    
    if (query) setSearchQuery(query)
    if (category) setSelectedCategory(category)
    if (price) setPriceRange(price)
    if (sort) setSortBy(sort)
  }, [location])
  
  // Get unique categories from books
  const categories = ['all', ...new Set(books.filter(book => book.format).map(book => book.format))]
  
  // Update URL with current filter state
  const updateUrlParams = () => {
    const searchParams = new URLSearchParams()
    
    if (searchQuery) searchParams.set('search', searchQuery)
    if (selectedCategory !== 'all') searchParams.set('category', selectedCategory)
    if (priceRange !== 'all') searchParams.set('price', priceRange)
    if (sortBy !== 'default') searchParams.set('sort', sortBy)
    
    navigate({
      pathname: location.pathname,
      search: searchParams.toString()
    }, { replace: true })
  }
  
  // Price range options
  const priceRanges = [
    { value: 'all', label: 'All Prices' },
    { value: 'under10', label: 'Under $10' },
    { value: '10to20', label: 'From $10 to $20' },
    { value: 'over20', label: 'Over $20' }
  ]
  
  // Sort options
  const sortOptions = [
    { value: 'default', label: 'Default' },
    { value: 'priceLow', label: 'Price: Low to High' },
    { value: 'priceHigh', label: 'Price: High to Low' },
    { value: 'titleAZ', label: 'Title: A to Z' },
    { value: 'titleZA', label: 'Title: Z to A' }
  ]
  
  // Filter and sort books
  const filteredAndSortedBooks = books
    .filter(book => {
      // Category filter
      const categoryMatch = selectedCategory === 'all' ? true : book.format === selectedCategory
      
      // Price filter
      let priceMatch = true
      if (priceRange === 'under10') {
        priceMatch = book.price < 10
      } else if (priceRange === '10to20') {
        priceMatch = book.price >= 10 && book.price <= 20
      } else if (priceRange === 'over20') {
        priceMatch = book.price > 20
      }
      
      // Search query
      const searchMatch = searchQuery === '' ? true : 
        (book.title && book.title.toLowerCase().includes(searchQuery.toLowerCase())) || 
        (book.author && book.author.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (book.description && book.description.toLowerCase().includes(searchQuery.toLowerCase()))
      
      return categoryMatch && priceMatch && searchMatch
    })
    .sort((a, b) => {
      if (sortBy === 'priceLow') {
        return a.price - b.price
      } else if (sortBy === 'priceHigh') {
        return b.price - a.price
      } else if (sortBy === 'titleAZ') {
        return a.title.localeCompare(b.title)
      } else if (sortBy === 'titleZA') {
        return b.title.localeCompare(a.title)
      }
      return 0
    })

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
  }
  
  const handleSearchSubmit = () => {
    updateUrlParams()
  }
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearchSubmit()
    }
  }

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value)
    // Update URL immediately when filter changes
    setTimeout(updateUrlParams, 0)
  }

  const handlePriceRangeChange = (e) => {
    setPriceRange(e.target.value)
    // Update URL immediately when filter changes
    setTimeout(updateUrlParams, 0)
  }

  const handleSortChange = (e) => {
    setSortBy(e.target.value)
    // Update URL immediately when sort changes
    setTimeout(updateUrlParams, 0)
  }

  const resetFilters = () => {
    setSearchQuery('')
    setSelectedCategory('all')
    setPriceRange('all')
    setSortBy('default')
    
    // Clear URL parameters
    navigate(location.pathname, { replace: true })
  }

  if (loading) {
    return (
      <Container className="books-container">
        <div className="loading-container">
          <CircularProgress size={60} />
          <Typography variant="h6" className="loading-text">
            Loading books...
          </Typography>
        </div>
      </Container>
    )
  }

  if (error) {
    return (
      <Container className="books-container">
        <Alert severity="error" className="error-alert">{error}</Alert>
      </Container>
    )
  }

  return (
    <Container className="books-container">
      <Typography variant="h4" component="h1" className="books-title">
        All Books
      </Typography>
      
      <div className="books-toolbar">
        <Grid container spacing={2}>
          {/* Search */}
          <Grid item xs={12} md={4}>
            <div className="search-box">
              <TextField
                fullWidth
                placeholder="Search by title, author, or keyword..."
                value={searchQuery}
                onChange={handleSearchChange}
                onKeyDown={handleKeyPress}
                variant="outlined"
                className="search-input"
                InputProps={{
                  endAdornment: (
                    <SearchIcon 
                      className="search-icon" 
                      onClick={handleSearchSubmit}
                      style={{ cursor: 'pointer' }}
                    />
                  )
                }}
              />
            </div>
          </Grid>
          
          {/* Filters */}
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth className="filter-control">
              <InputLabel>Format</InputLabel>
              <Select
                value={selectedCategory}
                onChange={handleCategoryChange}
                label="Format"
              >
                {categories.map(category => (
                  <MenuItem key={category} value={category}>
                    {category === 'all' ? 'All Formats' : category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth className="filter-control">
              <InputLabel>Price Range</InputLabel>
              <Select
                value={priceRange}
                onChange={handlePriceRangeChange}
                label="Price Range"
              >
                {priceRanges.map(range => (
                  <MenuItem key={range.value} value={range.value}>
                    {range.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth className="filter-control">
              <InputLabel>Sort By</InputLabel>
              <Select
                value={sortBy}
                onChange={handleSortChange}
                label="Sort By"
              >
                {sortOptions.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6} md={2}>
            <Button 
              variant="outlined" 
              fullWidth 
              onClick={resetFilters} 
              className="reset-button"
            >
              Reset Filters
            </Button>
          </Grid>
        </Grid>
      </div>
      
      {/* Results count */}
      <Typography variant="body2" className="results-count">
        Showing {filteredAndSortedBooks.length} of {books.length} books
      </Typography>
      
      {filteredAndSortedBooks.length === 0 ? (
        <div className="no-results">
          <Typography variant="h6">
            No books found matching your filters.
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={resetFilters}
            className="clear-filters-button"
          >
            Clear Filters
          </Button>
        </div>
      ) : (
        <BookList books={filteredAndSortedBooks} />
      )}
    </Container>
  )
}

export default Books 