import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  CardMedia,
  Snackbar,
  Box,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import axios from 'axios';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isLaptop = useMediaQuery(theme.breakpoints.up('md'));

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3000/user/getAllCartItems', {
          headers: {
            'auth-token': `${token}`,
          },
        });

        const itemsWithDetails = await Promise.all(response.data.cartItems.map(async (item) => {
          const productResponse = await axios.get(`http://localhost:3000/customer/getProduct/${item.productId}`);
          return { ...item, product: productResponse.data.item };
        }));
        setCartItems(itemsWithDetails);
      } catch (error) {
        console.error(error);
        setSnackbarMessage('Failed to load cart items');
        setSnackbarOpen(true);
      }
    };

    fetchCartItems();
  }, []);

  const handleBuyNow = (itemId) => {
    setSnackbarMessage(`Buying item with ID: ${itemId}`);
    setSnackbarOpen(true);
  };

  const handleDeleteFromCart = async (cartItemId) => {
    try {
      const token = localStorage.getItem('token');
      const res=await axios.delete(`http://localhost:3000/user/deleteCardItem/${cartItemId}`, {
        headers: {
          'auth-token': `${token}`,
        },
      });
      console.log(res);
      setCartItems(cartItems.filter(item => item._id !== cartItemId));
      setSnackbarMessage('Item removed from cart');
    } catch (error) {
      console.error(error);
      setSnackbarMessage('Failed to remove item from cart');
    }
    setSnackbarOpen(true);
  };

  return (
    <Container 
      maxWidth={false} 
      disableGutters 
      style={{ marginTop: '2rem' }} 
    >
      <Typography 
        variant="h4" 
        gutterBottom 
        style={{ color: 'black', padding: '16px', textAlign: 'center' }}
      >
        Your Cart
      </Typography>
      <Box 
        display="flex" 
        flexDirection="row" 
        flexWrap="wrap" 
        justifyContent="space-between"
        width="100%"
      >
        {cartItems.map((cartItem) => (
          <Box 
            key={cartItem._id}
            sx={{
              display: 'flex',
              width: isMobile ? '100%' : (isLaptop ? '48%' : '100%'),
              marginBottom: '1.5rem',
              padding: '10px',
            }}
          >
            <Card 
              sx={{ 
                display: 'flex', 
                flexDirection: 'row',
                width: '100%',
                backgroundColor: '#f5f5f5',  // Soft whitish background
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',  // Soft shadow
                borderRadius: '8px',  // Rounded corners for a professional look
                overflow: 'hidden',
              }}
            >
              <CardMedia
                component="img"
                alt={cartItem.product.productName}
                image={`data:image/png;base64,${cartItem.product.image}`}
                title={cartItem.product.productName}
                sx={{ 
                  width: '50%', 
                  height: 200, 
                  objectFit: 'cover', 
                  padding: '10px' 
                }}
              />
              <CardContent 
                sx={{ 
                  flex: 1, 
                  display: 'flex', 
                  flexDirection: 'column',
                  padding: '16px',
                  justifyContent: 'space-between',
                }}
              >
                <Box>
                  <Typography 
                    variant="h6" 
                    noWrap 
                    sx={{ fontWeight: 'bold', marginBottom: '8px' }}
                  >
                    {cartItem.product.productName}
                  </Typography>
                  <Typography variant="body1">
                    Quantity: {cartItem.quantity}
                  </Typography>
                  <Typography variant="body1">
                    Category: {cartItem.product.category}
                  </Typography>
                  <Typography variant="body1">
                    Price: ₹{cartItem.quantity * cartItem.product.price}
                  </Typography>
                  <Typography 
                    variant="body1" 
                    color={cartItem.product.stock > 0 ? 'green' : 'red'}
                  >
                    {cartItem.product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                  </Typography>
                </Box>
                <Box 
                  sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    marginTop: '16px' 
                  }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleBuyNow(cartItem.product._id)}
                    disabled={cartItem.product.stock === 0}
                    sx={{ 
                      flex: 1, 
                      padding: '10px',  // Ensure buttons have enough padding
                      marginRight: '10px',  // Add margin between buttons
                      fontSize: '0.9rem',  // Adjust font size
                    }}
                  >
                    Buy Now
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => handleDeleteFromCart(cartItem.productId)}
                    sx={{ 
                      flex: 1, 
                      padding: '10px', 
                      fontSize: '0.9rem',
                    }}
                  >
                    Delete
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </Container>
  );
};

export default CartPage;
