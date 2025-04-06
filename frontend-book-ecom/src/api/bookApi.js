// Book API service for communicating with the backend

const API_URL = 'http://localhost:5000';

// Get all books
export const getAllBooks = async () => {
  console.log('getAllBooks: Fetching books from API at', `${API_URL}/books`);
  try {
    // Add headers to prevent caching
    const response = await fetch(`${API_URL}/books`, {
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    });
    console.log('getAllBooks: Response status:', response.status);
    
    if (!response.ok) {
      throw new Error(`Error fetching books: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('getAllBooks: Raw response data:', JSON.stringify(data).substring(0, 500) + '...');
    
    // Handle the nested books array in the response
    if (data && data.books && Array.isArray(data.books)) {
      console.log('getAllBooks: Found nested books array with', data.books.length, 'books');
      console.log('getAllBooks: First book sample:', data.books[0]);
      return data.books;
    } else if (Array.isArray(data)) {
      console.log('getAllBooks: Data is already an array with', data.length, 'books');
      console.log('getAllBooks: First book sample:', data[0]);
      return data;
    } else {
      console.error('getAllBooks: Unexpected data format', typeof data, data);
      
      // Last resort - try to find any array property in the response
      const arrayProps = Object.entries(data || {})
        .filter(([_, value]) => Array.isArray(value))
        .map(([key, value]) => ({ key, length: value.length }));
      
      if (arrayProps.length > 0) {
        console.log('getAllBooks: Found potential book arrays:', arrayProps);
        const bestMatch = arrayProps.sort((a, b) => b.length - a.length)[0];
        console.log('getAllBooks: Using array from property:', bestMatch.key);
        return data[bestMatch.key];
      }
      
      return [];
    }
  } catch (error) {
    console.error('getAllBooks: Error details:', error);
    throw error;
  }
};

// Get a single book by ID
export const getBookById = async (id) => {
  console.log(`getBookById: Fetching book with ID ${id}`);
  try {
    const response = await fetch(`${API_URL}/book/${id}`);
    console.log('getBookById: Response status:', response.status);
    
    if (!response.ok) {
      throw new Error(`Error fetching book: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('getBookById: Received data:', data);
    return data;
  } catch (error) {
    console.error(`getBookById: Error fetching book with ID ${id}:`, error);
    throw error;
  }
};

// Create a new book
export const createBook = async (bookData, isFileUpload = false) => {
  console.log('createBook: Creating new book:', isFileUpload ? 'With file upload' : bookData);
  try {
    const token = localStorage.getItem('token');
    
    // Prepare headers based on whether we're uploading files or sending JSON
    let headers = {
      'Authorization': `Bearer ${token}`
    };
    
    // Don't add Content-Type for FormData (browser will set it with boundary)
    if (!isFileUpload) {
      headers['Content-Type'] = 'application/json';
    }
    
    // Prepare request body
    let body;
    if (isFileUpload) {
      // FormData is already prepared in the component
      body = bookData;
    } else {
      // JSON data
      body = JSON.stringify(bookData);
    }
    
    const response = await fetch(`${API_URL}/books`, {
      method: 'POST',
      headers: headers,
      body: body
    });
    
    console.log('createBook: Response status:', response.status);
    if (!response.ok) {
      // Try to get error message from response
      let errorMessage;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || `Error creating book: ${response.status} ${response.statusText}`;
      } catch (e) {
        errorMessage = `Error creating book: ${response.status} ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }
    
    const data = await response.json();
    console.log('createBook: Book created successfully:', data);
    return data;
  } catch (error) {
    console.error('createBook: Error creating book:', error);
    throw error;
  }
};

// Search books with advanced filters
export const searchBooks = async (searchParams) => {
  console.log('searchBooks: Searching with params:', searchParams);
  try {
    const queryString = new URLSearchParams(searchParams).toString();
    const response = await fetch(`${API_URL}/books/search?${queryString}`);
    
    console.log('searchBooks: Response status:', response.status);
    if (!response.ok) {
      throw new Error(`Error searching books: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('searchBooks: Search results:', data);
    
    // Handle the nested books array in the response
    if (data && data.books && Array.isArray(data.books)) {
      return data.books;
    } else if (Array.isArray(data)) {
      return data;
    } else {
      console.error('searchBooks: Unexpected data format', data);
      return [];
    }
  } catch (error) {
    console.error('searchBooks: Error searching books:', error);
    throw error;
  }
};

// Get featured books
export const getFeaturedBooks = async () => {
  console.log('getFeaturedBooks: Fetching featured books');
  try {
    const response = await fetch(`${API_URL}/books/featured`);
    
    console.log('getFeaturedBooks: Response status:', response.status);
    if (!response.ok) {
      throw new Error(`Error fetching featured books: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('getFeaturedBooks: Received featured books:', data);
    
    // Handle the nested featured_books array in the response
    if (data && data.featured_books && Array.isArray(data.featured_books)) {
      return data.featured_books;
    } else if (Array.isArray(data)) {
      return data;
    } else {
      console.error('getFeaturedBooks: Unexpected data format', data);
      return [];
    }
  } catch (error) {
    console.error('getFeaturedBooks: Error fetching featured books:', error);
    throw error;
  }
};