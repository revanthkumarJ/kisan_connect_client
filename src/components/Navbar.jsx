import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box, TextField, IconButton } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useAuth } from '../pages/AuthContext';
import logo from '../assets/logo.jpg';
import { debounce } from 'lodash';

const Navbar = () => {
  const { isLoggedIn } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const appBarColor = location.pathname === '/' ? '#795548' : '#4CAF50';

  // Debounced search function
  const handleSearch = debounce((query) => {
    if (query) {
      navigate(`/search?query=${query}`);
    }
  }, 2000); // Wait for 3 seconds after the user stops typing

  useEffect(() => {
    handleSearch(searchQuery);
  }, [searchQuery]); // Trigger the debounced function on searchQuery change

  return (
    <AppBar position="sticky" sx={{ bgcolor: appBarColor }}>
      <Toolbar>
        <Box display="flex" alignItems="center">
          <Link to="/" style={{ color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
            <img src={logo} alt="Kisan Connect Logo" style={{ width: 40, height: 40, marginRight: '8px' }} />
            <Typography variant="h6" component="div">
              KISAN Connect
            </Typography>
          </Link>
        </Box>
        <Box sx={{ flexGrow: 1 }} />
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <TextField
            variant="outlined"
            placeholder="Search..."
            size="small"
            sx={{ bgcolor: 'white', borderRadius: 1, mr: 2 }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {isLoggedIn ? (
            <IconButton sx={{ color: 'white' }} component={Link} to="/profile">
              <AccountCircleIcon />
            </IconButton>
          ) : (
            <Button sx={{ color: 'white' }} component={Link} to="/login">
              Login
            </Button>
          )}
          <Button sx={{ color: 'white' }} component={Link} to="/cart">
            Cart
          </Button>
          <Button sx={{ color: 'white' }} component={Link} to="/become-seller">
            Become a Seller
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
