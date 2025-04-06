/**
 * Utility functions for handling book data
 */

/**
 * Returns a color for the book condition
 * @param {string} condition - The book condition
 * @returns {string} - A hex color code
 */
export const getConditionColor = (condition) => {
  const conditionMap = {
    'New': '#4caf50',
    'Like New': '#8bc34a',
    'Very Good': '#009688',
    'Good': '#03a9f4',
    'Fair': '#ff9800',
    'Poor': '#f44336',
    'Unknown': '#9e9e9e'
  };
  
  return conditionMap[condition] || conditionMap['Unknown'];
};

/**
 * Returns a description for the book condition
 * @param {string} condition - The book condition
 * @returns {string} - A description of the condition
 */
export const getConditionDescription = (condition) => {
  const descriptionMap = {
    'New': 'Brand new, never used, and in perfect condition.',
    'Like New': 'Looks new but may have been read. No defects or signs of use.',
    'Very Good': 'May show some small signs of wear but no tears, creases, or highlights.',
    'Good': 'Shows signs of wear but remains intact and readable with no major issues.',
    'Fair': 'Noticeably used with possible writing, highlighting, or wear. All pages intact.',
    'Poor': 'Significantly worn with possible damage, but complete and readable.',
    'Unknown': 'Condition not specified.'
  };
  
  return descriptionMap[condition] || descriptionMap['Unknown'];
};

/**
 * Formats a price to a currency string
 * @param {number|string} price - The price to format
 * @param {string} currency - Currency symbol (default: $)
 * @returns {string} - Formatted price string
 */
export const formatPrice = (price, currency = '$') => {
  const numPrice = parseFloat(price);
  if (isNaN(numPrice)) return `${currency}0.00`;
  return `${currency}${numPrice.toFixed(2)}`;
};

/**
 * Truncates text to a specified length and adds ellipsis
 * @param {string} text - The text to truncate
 * @param {number} maxLength - Maximum length before truncation
 * @returns {string} - Truncated text
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

/**
 * Formats a date string into a readable format
 * @param {string} dateString - ISO date string
 * @returns {string} - Formatted date
 */
export const formatDate = (dateString) => {
  if (!dateString) return 'Unknown date';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  } catch (e) {
    return 'Invalid date';
  }
};

/**
 * Checks if all required fields are filled in a book object
 * @param {Object} book - Book object
 * @returns {boolean} - Whether all required fields are filled
 */
export const isBookComplete = (book) => {
  const requiredFields = ['title', 'author', 'price', 'description', 'condition'];
  return requiredFields.every(field => !!book[field]);
};

/**
 * Gets the appropriate image URL for a book
 * @param {Object} book - Book object
 * @returns {string} - Image URL
 */
export const getBookImageUrl = (book) => {
  if (!book) return '/placeholder-book.jpg';
  return book.image_url || book.imageUrl || '/placeholder-book.jpg';
};
