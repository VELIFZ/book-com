import { useState } from 'react';
import { 
  Drawer, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemAvatar, 
  Avatar, 
  Typography, 
  IconButton, 
  Button, 
  Box, 
  Divider,
  TextField
} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const { 
    cart, 
    cartOpen, 
    setCartOpen, 
    removeFromCart, 
    updateQuantity,
    clearCart,
    getTotalPrice 
  } = useCart();

  const handleClose = () => {
    setCartOpen(false);
  };

  const handleCheckout = () => {
    // Future implementation: connect to payment processing
    alert('Checkout functionality will be implemented in a future update!');
    clearCart();
    setCartOpen(false);
  };

  const totalPrice = getTotalPrice().toFixed(2);
  const cartIsEmpty = cart.length === 0;

  return (
    <Drawer
      anchor="right"
      open={cartOpen}
      onClose={handleClose}
      PaperProps={{
        sx: { width: { xs: '100%', sm: 400 } }
      }}
    >
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Your Cart ({cart.length} items)</Typography>
        <IconButton onClick={handleClose} edge="end">
          <CloseIcon />
        </IconButton>
      </Box>
      
      <Divider />
      
      {cartIsEmpty ? (
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="body1" sx={{ mb: 2 }}>Your cart is empty</Typography>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleClose}
          >
            Continue Shopping
          </Button>
        </Box>
      ) : (
        <>
          <List sx={{ flexGrow: 1, overflow: 'auto', p: 0 }}>
            {cart.map((item) => (
              <ListItem 
                key={item.id}
                divider
                secondaryAction={
                  <IconButton 
                    edge="end" 
                    onClick={() => removeFromCart(item.id)}
                    size="small"
                  >
                    <DeleteOutlineIcon />
                  </IconButton>
                }
                sx={{ pt: 2, pb: 2 }}
              >
                <ListItemAvatar>
                  <Avatar 
                    variant="rounded" 
                    src={item.image_url || item.imageUrl || '/placeholder-book.jpg'} 
                    alt={item.title}
                    sx={{ width: 60, height: 60, mr: 2 }}
                  />
                </ListItemAvatar>
                
                <ListItemText
                  primary={item.title}
                  secondary={
                    <Typography variant="body2" color="text.secondary">
                      ${Number(item.price).toFixed(2)}
                    </Typography>
                  }
                  sx={{ mr: 2 }}
                />
                
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <IconButton 
                    size="small" 
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    <RemoveIcon fontSize="small" />
                  </IconButton>
                  
                  <TextField
                    value={item.quantity}
                    onChange={(e) => {
                      const newQuantity = parseInt(e.target.value);
                      if (!isNaN(newQuantity)) {
                        updateQuantity(item.id, newQuantity);
                      }
                    }}
                    inputProps={{ 
                      min: 1, 
                      style: { textAlign: 'center', width: '30px', padding: '5px' } 
                    }}
                    variant="standard"
                    size="small"
                    sx={{ mx: 1 }}
                  />
                  
                  <IconButton 
                    size="small" 
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    <AddIcon fontSize="small" />
                  </IconButton>
                </Box>
              </ListItem>
            ))}
          </List>
          
          <Box sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6">Total:</Typography>
              <Typography variant="h6">${totalPrice}</Typography>
            </Box>
            
            <Button 
              variant="contained" 
              color="primary" 
              fullWidth 
              onClick={handleCheckout}
              sx={{ mb: 1 }}
            >
              Checkout
            </Button>
            
            <Button 
              variant="outlined" 
              color="secondary" 
              fullWidth 
              onClick={clearCart}
            >
              Clear Cart
            </Button>
          </Box>
        </>
      )}
    </Drawer>
  );
};

export default Cart; 