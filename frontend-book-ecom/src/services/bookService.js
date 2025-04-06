import axios from 'axios';

// Update API URL to match the one working in Profile.jsx
const API_URL = 'http://localhost:5000';

// Get all books
export const getBooks = async () => {
  try {
    const response = await axios.get(`${API_URL}/books`);
    return response.data;
  } catch (error) {
    console.error('Error fetching books:', error);
    throw error;
  }
};

// Get a single book by ID
export const getBook = async (id) => {
  try {
    console.log(`getBook: Attempting to fetch book with ID ${id}`);
    console.log(`getBook: Full URL being called: ${API_URL}/book/${id}`);
    
    const response = await axios.get(`${API_URL}/book/${id}`);
    console.log('getBook: Response received:', response);
    return response.data;
  } catch (error) {
    console.error(`Error fetching book ${id}:`, error);
    // Log the specific error details
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('getBook: Error response data:', error.response.data);
      console.error('getBook: Error response status:', error.response.status);
      console.error('getBook: Error response headers:', error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('getBook: No response received:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('getBook: Error message:', error.message);
    }
    throw error;
  }
};

// Create a new book
export const createBook = async (bookData) => {
  try {
    const response = await axios.post(`${API_URL}/books`, bookData);
    return response.data;
  } catch (error) {
    console.error('Error creating book:', error);
    throw error;
  }
};

// Update a book
export const updateBook = async (id, bookData, isFileUpload = false) => {
  try {
    console.log(`updateBook: Updating book ${id}`, isFileUpload ? 'with file upload' : 'with JSON data');
    console.log('Book data being sent:', bookData);
    
    // Ensure we're working with a numeric ID
    const bookId = Number(id);
    if (isNaN(bookId)) {
      throw new Error('Invalid book ID. Must be a number.');
    }
    
    const token = localStorage.getItem('token');
    let response;
    
    // Log the exact URL we're going to call
    const url = `${API_URL}/book/${bookId}`;
    console.log(`Making PUT request to: ${url}`);
    
    if (isFileUpload) {
      // Check if bookData is actually FormData
      if (!(bookData instanceof FormData)) {
        console.error('Error: bookData is not FormData but isFileUpload is true');
        throw new Error('Invalid data format for file upload');
      }
      
      console.log('Using FormData for file upload');
      // Let axios handle the FormData content-type automatically
      response = await axios({
        method: 'PUT',
        url: url,
        data: bookData,
        headers: {
          'Authorization': token ? `Bearer ${token}` : undefined
          // Do NOT set Content-Type - axios will set it with proper boundary
        }
      });
    } else {
      // JSON data
      console.log('Using JSON data');
      response = await axios({
        method: 'PUT',
        url: url,
        data: bookData,
        headers: {
          'Authorization': token ? `Bearer ${token}` : undefined,
          'Content-Type': 'application/json'
        }
      });
    }
    
    console.log('updateBook: Book updated successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error(`Error updating book ${id}:`, error);
    
    // Enhanced error logging
    if (error.response) {
      console.error('Error response details:', {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data
      });
    } else if (error.request) {
      console.error('No response received:', error.request);
    }
    
    throw error;
  }
};

// Delete a book
export const deleteBook = async (id) => {
  try {
    console.log(`deleteBook: Attempting to delete book with ID: ${id}`);
    
    // Ensure we're working with a numeric ID
    const bookId = Number(id);
    if (isNaN(bookId)) {
      throw new Error('Invalid book ID. Must be a number.');
    }
    
    // First try the special endpoint that preserves reviews
    try {
      const preserveUrl = `${API_URL}/api/books/${bookId}/delete-preserve-reviews`;
      console.log(`Making DELETE request to special endpoint: ${preserveUrl}`);
      
      const response = await axios.delete(preserveUrl);
      console.log(`Book successfully deleted with reviews preserved:`, response.data);
      return response.data;
    } catch (specialEndpointError) {
      console.warn('Special delete endpoint failed, falling back to standard deletion:', specialEndpointError);
      
      // If the special endpoint fails, fall back to the standard deletion
      const standardUrl = `${API_URL}/book/${bookId}`;
      console.log(`Falling back to standard endpoint: ${standardUrl}`);
      
      const response = await axios.delete(standardUrl);
      console.log(`Book deleted using standard endpoint:`, response.data);
      return response.data;
    }
  } catch (error) {
    console.error(`Error deleting book ${id}:`, error);
    
    // Enhanced error logging
    if (error.response) {
      console.error('Error response details:', {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data
      });
    } else if (error.request) {
      console.error('No response received:', error.request);
    }
    
    throw error;
  }
};

// Search for books
export const searchBooks = async (query) => {
  try {
    const response = await axios.get(`${API_URL}/books/search?q=${query}`);
    return response.data;
  } catch (error) {
    console.error(`Error searching books with query "${query}":`, error);
    throw error;
  }
}; 