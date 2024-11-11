import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box, TextField, IconButton,Switch } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import logo from '../assets/logo.jpg';
import { debounce } from 'lodash';
import { useAuth } from '../pages/AuthContext';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const { isLoggedIn, mode, toggle} = useAuth();

  // Determine the app bar color based on the location pathname
  const appBarColor = location.pathname === '/' ? '#795548' : '#4CAF50';

  // Get user role from localStorage
  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.roles?.isAdmin;
  const isFarmer = user?.roles?.isFarmer;
  const isCustomer = user?.roles?.isCustomer;
  const isDeliveryBoy = user?.roles?.isDeliveryBoy;

  // Debounced search function
  const handleSearch = debounce((query) => {
    if (query) {
      navigate(`/search?query=${query}`);
    }
  }, 2000); // Wait for 2 seconds after the user stops typing

  useEffect(() => {
    handleSearch(searchQuery);
  }, [searchQuery]);

  return (
    <AppBar position="sticky" sx={{ bgcolor: appBarColor }}>
      <Toolbar>
        {/* Logo and Title */}
        <Box display="flex" alignItems="center">
          <Link to="/" style={{ color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
            <img src={logo} alt="Kisan Connect Logo" style={{ width: 40, height: 40, marginRight: '8px' }} />
            <Typography variant="h6" component="div">
              KISAN Connect
            </Typography>
          </Link>
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        {/* Search, Role-Based Button, Cart, and Login/Profile */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {/* Search Box */}
          <TextField
            variant="outlined"
            placeholder="Search..."
            size="small"
            sx={{ bgcolor: 'white', borderRadius: 1, mr: 2 }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          {/* Role-based Navigation Button */}
          {isAdmin ? (
            <Button sx={{ color: 'white' }} component={Link} to="/admin">
              Admin Page
            </Button>
          ) : isFarmer ? (
            <Button sx={{ color: 'white' }} component={Link} to="/Farmer">
              My Products
            </Button>
          ) : isDeliveryBoy ? (
            <Button sx={{ color: 'white' }} component={Link} to="/orders">
              Orders
            </Button>
          ):isCustomer? (
            <Button sx={{ color: 'white' }} component={Link} to="/become-seller">
              Become a Seller
            </Button>
          ):(<></>)
        }

          <Button sx={{ color: 'white' }} component={Link} to="/AboutUs">
            About Us
          </Button>

          {/* Cart Button */}
          <IconButton sx={{ color: 'white' }} component={Link} to="/cart">
            <ShoppingCartIcon />
          </IconButton>

          {/* Login or Profile */}
          {user ? (
            <IconButton sx={{ color: 'white' }} component={Link} to="/profile">
              <AccountCircleIcon />
            </IconButton>
          ) : (
            <Button sx={{ color: 'white' }} component={Link} to="/login">
              login
            </Button>
          )}
          <Switch checked={mode === 'dark'} onChange={toggle} />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
