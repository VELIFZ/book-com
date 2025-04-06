import { useState } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Button, 
  Grid, 
  Paper, 
  IconButton, 
  Divider,
  TextField,
  Card,
  CardMedia,
  CardContent,
  Alert
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useCart } from '../context/CartContext';
import '../styles/Cart.css';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart, cartTotal } = useCart();
  const navigate = useNavigate();
  const [promoCode, setPromoCode] = useState('');
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');

  // Handle quantity changes
  const handleQuantityChange = (bookId, newQuantity) => {
    if (newQuantity < 1) {
      // If quantity is less than 1, remove the item
      removeFromCart(bookId);
    } else {
      // Otherwise update the quantity
      updateQuantity(bookId, newQuantity);
    }
  };

  // Handle promo code submission (mock implementation)
  const handlePromoSubmit = (e) => {
    e.preventDefault();
    
    // Mock implementation - in reality would validate against backend
    if (promoCode.toLowerCase() === 'discount10') {
      setPromoSuccess('10% discount applied!');
      setPromoError('');
    } else {
      setPromoError('Invalid promo code');
      setPromoSuccess('');
    }
  };

  // Begin checkout process
  const handleCheckout = () => {
    // Navigate to checkout page - will implement later
    navigate('/checkout');
  };

  // If cart is empty
  if (cartItems.length === 0) {
    return (
      <Container maxWidth="md" className="cart-container">
        <Box className="empty-cart">
          <ShoppingCartIcon sx={{ fontSize: 60, color: 'text.secondary' }} />
          <Typography variant="h5" gutterBottom>Your cart is empty</Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            Looks like you haven't added any books to your cart yet.
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            component={Link} 
            to="/books"
            className="browse-button"
          >
            Browse Books
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" className="cart-container">
      <Typography variant="h4" gutterBottom className="cart-title">
        Your Cart ({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})
      </Typography>

      <Grid container spacing={3}>
        {/* Cart Items */}
        <Grid item xs={12} md={8}>
          <Paper className="cart-items-container">
            {cartItems.map(item => (
              <Box key={item.id} className="cart-item">
                <Card className="cart-item-card">
                  <Grid container>
                    {/* Book Image */}
                    <Grid item xs={3} sm={2}>
                      <CardMedia
                        component="img"
                        className="cart-item-image"
                        image={item.image_url || 'https://via.placeholder.com/150x200?text=No+Image'}
                        alt={item.title}
                      />
                    </Grid>
                    
                    {/* Book Details */}
                    <Grid item xs={6} sm={7}>
                      <CardContent className="cart-item-details">
                        <Typography variant="h6" className="cart-item-title">
                          {item.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {item.author}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" className="cart-item-format">
                          Format: {item.format || 'Paperback'}
                        </Typography>
                        <Typography variant="body2" className="cart-item-price" color="primary">
                          ${item.price.toFixed(2)}
                        </Typography>
                      </CardContent>
                    </Grid>
                    
                    {/* Quantity Controls */}
                    <Grid item xs={3} sm={3} className="cart-item-actions">
                      <Box className="quantity-control">
                        <IconButton 
                          size="small" 
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        >
                          <RemoveIcon fontSize="small" />
                        </IconButton>
                        <Typography className="quantity-display">
                          {item.quantity}
                        </Typography>
                        <IconButton 
                          size="small" 
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        >
                          <AddIcon fontSize="small" />
                        </IconButton>
                      </Box>
                      <IconButton 
                        color="error" 
                        onClick={() => removeFromCart(item.id)}
                        className="remove-item-button"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                </Card>
              </Box>
            ))}
            
            <Box className="cart-actions">
              <Button 
                variant="outlined" 
                color="primary" 
                component={Link} 
                to="/books"
                className="continue-shopping"
              >
                Continue Shopping
              </Button>
              <Button 
                variant="outlined" 
                color="error" 
                onClick={clearCart}
                className="clear-cart"
              >
                Clear Cart
              </Button>
            </Box>
          </Paper>
        </Grid>
        
        {/* Order Summary */}
        <Grid item xs={12} md={4}>
          <Paper className="order-summary">
            <Typography variant="h6" gutterBottom>
              Order Summary
            </Typography>
            
            <Box className="summary-item">
              <Typography variant="body1">Subtotal</Typography>
              <Typography variant="body1">${cartTotal.toFixed(2)}</Typography>
            </Box>
            
            <Box className="summary-item">
              <Typography variant="body1">Shipping</Typography>
              <Typography variant="body1">Free</Typography>
            </Box>
            
            {promoSuccess && (
              <Box className="summary-item">
                <Typography variant="body1">Discount</Typography>
                <Typography variant="body1" color="success.main">-${(cartTotal * 0.1).toFixed(2)}</Typography>
              </Box>
            )}
            
            <Divider className="summary-divider" />
            
            <Box className="summary-item total">
              <Typography variant="h6">Total</Typography>
              <Typography variant="h6">
                ${promoSuccess ? (cartTotal * 0.9).toFixed(2) : cartTotal.toFixed(2)}
              </Typography>
            </Box>
            
            {/* Promo Code */}
            <Box component="form" onSubmit={handlePromoSubmit} className="promo-form">
              <TextField
                size="small"
                label="Promo Code"
                variant="outlined"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className="promo-input"
                error={!!promoError}
                helperText={promoError}
              />
              <Button 
                type="submit" 
                variant="outlined" 
                size="small"
                className="apply-promo"
              >
                Apply
              </Button>
            </Box>
            
            {promoSuccess && (
              <Alert severity="success" className="promo-success">
                {promoSuccess}
              </Alert>
            )}
            
            <Button 
              variant="contained" 
              color="primary" 
              fullWidth 
              size="large"
              onClick={handleCheckout}
              className="checkout-button"
            >
              Proceed to Checkout
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Cart; 