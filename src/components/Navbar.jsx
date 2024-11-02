import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box, TextField, IconButton } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle'; // Import profile icon
import { useAuth } from '../pages/AuthContext';

const Navbar = () => {
  const { isLoggedIn } = useAuth();

  const location = useLocation();

 
  // Set the color conditionally based on the current route
  const appBarColor = location.pathname === '/' ? '#795548' : '#4CAF50'; // Brown for home, green for others

  return (
    <AppBar position="sticky" sx={{ bgcolor: appBarColor }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
            KISAN Connect
          </Link>
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <TextField
            variant="outlined"
            placeholder="Search..."
            size="small"
            sx={{ bgcolor: 'white', borderRadius: 1, mr: 2 }}
          />
          
          {/* Conditionally render Login or Profile based on the token */}
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
