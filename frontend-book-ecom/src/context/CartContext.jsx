import { createContext, useContext, useState, useEffect } from 'react';

// Create the cart context
const CartContext = createContext();

// Custom hook to use the cart context
export const useCart = () => useContext(CartContext);

// Cart provider component
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    // Load cart from localStorage on initial render
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  
  const [cartOpen, setCartOpen] = useState(false);
  
  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);
  
  // Add item to cart
  const addToCart = (item) => {
    setCart(prevCart => {
      // Check if item already exists in cart
      const existingItem = prevCart.find(cartItem => cartItem.id === item.id);
      
      if (existingItem) {
        // Increase quantity if item already in cart
        return prevCart.map(cartItem => 
          cartItem.id === item.id 
            ? { ...cartItem, quantity: cartItem.quantity + 1 } 
            : cartItem
        );
      } else {
        // Add new item with quantity 1
        return [...prevCart, { ...item, quantity: 1 }];
      }
    });
  };
  
  // Remove item from cart
  const removeFromCart = (itemId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== itemId));
  };
  
  // Update item quantity
  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(itemId);
      return;
    }
    
    setCart(prevCart => 
      prevCart.map(item => 
        item.id === itemId 
          ? { ...item, quantity: newQuantity } 
          : item
      )
    );
  };
  
  // Clear entire cart
  const clearCart = () => {
    setCart([]);
  };
  
  // Calculate total items in cart
  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };
  
  // Calculate cart total price
  const getTotalPrice = () => {
    return cart.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  };
  
  // Toggle cart sidebar
  const toggleCart = () => {
    setCartOpen(prevState => !prevState);
  };
  
  // Value to be provided by the context
  const value = {
    cart,
    cartOpen,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
    toggleCart,
    setCartOpen
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext; 