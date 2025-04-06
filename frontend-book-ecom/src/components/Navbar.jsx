import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  InputBase,
  Badge,
  Stack,
  Container,
  Divider,
  Avatar,
  Menu,
  MenuItem
} from '@mui/material'
import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import SearchIcon from '@mui/icons-material/Search'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'
import LocalOfferIcon from '@mui/icons-material/LocalOffer'
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline'
import StorefrontIcon from '@mui/icons-material/Storefront'
import LogoutIcon from '@mui/icons-material/Logout'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import '../styles/Navbar.css'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import Cart from './Cart'

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const { getTotalItems, toggleCart } = useCart();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
    navigate('/');
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/books?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery(''); // Clear search field after submitting
    }
  };

  // Handle search when Enter key is pressed
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      handleSearchSubmit(e);
    }
  };

  // Get cart item count
  const itemCount = getTotalItems();

  return (
    <>
      {/* Main navbar container with elevation and sticky position */}
      <AppBar position="sticky" color="default" elevation={3} className="navbar">
        {/* Top Navbar Section */}
        <Container maxWidth="xl">
          {/* Main toolbar containing logo, search, and buttons */}
          <Toolbar className="navbar-toolbar">
            {/* Logo/Brand Name */}
            <Typography
              variant="h5"
              component={Link}
              to="/"
              className="navbar-logo"
              sx={{ textDecoration: 'none', color: 'inherit' }}
            >
              BookStore
            </Typography>

            {/* Search Bar Container */}
            <Box className="search-box" component="form" onSubmit={handleSearchSubmit}>
              <InputBase
                placeholder="Search by keyword, title, author, ISBN..."
                className="search-input"
                value={searchQuery}
                onChange={handleSearchChange}
                onKeyPress={handleKeyPress}
              />
              <IconButton type="submit" className="search-button">
                <SearchIcon />
              </IconButton>
            </Box>

            {/* Right Side Navigation Buttons */}
            <Stack direction="row" spacing={2} alignItems="center" className="nav-buttons">
              {currentUser ? (
                <>
                  <IconButton
                    onClick={handleProfileMenuOpen}
                    size="medium"
                    edge="end"
                    aria-label="account of current user"
                    aria-haspopup="true"
                    color="inherit"
                  >
                    <Avatar sx={{ width: 32, height: 32 }}>
                      {currentUser.first_name ? currentUser.first_name[0] : ''}
                    </Avatar>
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                  >
                    <MenuItem component={Link} to="/profile" onClick={handleMenuClose}>
                      <AccountCircleIcon fontSize="small" sx={{ mr: 1 }} />
                      Profile
                    </MenuItem>
                    <MenuItem onClick={handleLogout}>
                      <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
                      Logout
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <>
                  <Button
                    component={Link}
                    to="/login"
                    startIcon={<PersonOutlineIcon />}
                    color="inherit"
                    className="nav-button"
                  >
                    Login
                  </Button>
                  <Button
                    component={Link}
                    to="/register"
                    variant="outlined"
                    color="primary"
                    className="nav-button"
                  >
                    Register
                  </Button>
                </>
              )}
              <IconButton
                onClick={toggleCart}
                color="inherit"
                className="cart-button"
                aria-label="Shopping Cart"
              >
                <Badge badgeContent={itemCount} color="primary">
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>
            </Stack>
          </Toolbar>
        </Container>

        <Divider />

        {/* Bottom Navigation Bar */}
        <Container maxWidth="xl">
          <Toolbar className="bottom-navbar">
            <Stack direction="row" spacing={3} className="bottom-nav-buttons">
              {/* Bottom Navigation Links */}
              <Button
                component={Link}
                to="/books"
                color="inherit"
                size="small"
                className="bottom-nav-button"
              >
                Books
              </Button>
              <Button
                component={Link}
                to="/discounts"
                startIcon={<LocalOfferIcon />}
                color="inherit"
                size="small"
                className="bottom-nav-button"
              >
                Discounts
              </Button>
              <Button
                component={Link}
                to="/community"
                startIcon={<PeopleOutlineIcon />}
                color="inherit"
                size="small"
                className="bottom-nav-button"
              >
                Community
              </Button>
              <Button
                component={Link}
                to="/sellers"
                startIcon={<StorefrontIcon />}
                color="inherit"
                size="small"
                className="bottom-nav-button"
              >
                Sellers
              </Button>
              <Button
                component={Link}
                to="/sell"
                variant="contained"
                color="primary"
                size="small"
                className="sell-button"
              >
                Start Selling
              </Button>
            </Stack>
          </Toolbar>
        </Container>
      </AppBar>
      
      {/* Cart Drawer */}
      <Cart />
    </>
  )
}

export default Navbar 