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
import { useNavigate } from 'react-router-dom';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import HistoryIcon from '@mui/icons-material/History';
import { useAuth } from './AuthContext';

const CartPage = () => {
  const { mode } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const navigate = useNavigate();

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

        const itemsWithDetails = await Promise.all(
          response.data.cartItems.map(async (item) => {
            const productResponse = await axios.get(`http://localhost:3000/customer/getProduct/${item.productId}`);
            return { ...item, product: productResponse.data.item };
          })
        );
        setCartItems(itemsWithDetails);
      } catch (error) {
        console.error(error);
        setSnackbarMessage('Failed to load cart items');
        setSnackbarOpen(true);
      }
    };

    fetchCartItems();
  }, []);

  const handleBuyNow = (productId, quantity) => {
    navigate(`/place-order?productId=${productId}&quantity=${quantity}`);
  };

  const handleDeleteFromCart = async (cartItemId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`http://localhost:3000/user/deleteCardItem/${cartItemId}`, {
        headers: {
          'auth-token': `${token}`,
        },
      });

      if (response.status === 200) {
        setCartItems(cartItems.filter((item) => item.productId !== cartItemId));
        setSnackbarMessage('Item removed from cart');
      } else {
        setSnackbarMessage('Failed to remove item from cart');
      }
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
      sx={{
        paddingTop: '2rem',
        backgroundColor: mode === 'dark' ? '#121212' : '#ffffff',
        minHeight: '100vh',
        padding: '16px',
      }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        sx={{ padding: '16px', color: mode === 'dark' ? '#ffffff' : '#000000' }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            color: mode === 'dark' ? '#ffffff' : '#000000',
            textAlign: 'center',
          }}
        >
          Your Cart
        </Typography>
        <Box display="flex" flexDirection="column" alignItems="flex-end">
          <Button
            variant="contained"
            startIcon={<LocalShippingIcon />}
            onClick={() => navigate('/OnTheWay')}
            sx={{ mb: 1, width: '200px', backgroundColor: mode === 'dark' ? '#bb86fc' : '#3f51b5' }}
          >
            On the Way
          </Button>
          <Button
            variant="contained"
            startIcon={<HistoryIcon />}
            onClick={() => navigate('/Delivered')}
            sx={{ width: '200px', backgroundColor: mode === 'dark' ? '#bb86fc' : '#3f51b5' }}
          >
            Previous Orders
          </Button>
        </Box>
      </Box>
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
              width: isMobile ? '100%' : isLaptop ? '48%' : '100%',
              marginBottom: '1.5rem',
              padding: '10px',
            }}
          >
            <Card
              sx={{
                display: 'flex',
                flexDirection: 'row',
                width: '100%',
                backgroundColor: mode === 'dark' ? '#1f1f1f' : '#f5f5f5',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                borderRadius: '8px',
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
                  padding: '10px',
                }}
              />
              <CardContent
                sx={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '16px',
                  justifyContent: 'space-between',
                  color: mode === 'dark' ? '#ffffff' : '#000000',
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
                  <Typography variant="body1">Quantity: {cartItem.quantity}</Typography>
                  <Typography variant="body1">Category: {cartItem.product.category}</Typography>
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
                    marginTop: '16px',
                  }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleBuyNow(cartItem.product._id, cartItem.quantity)}
                    disabled={cartItem.product.stock === 0}
                    sx={{
                      flex: 1,
                      padding: '10px',
                      marginRight: '10px',
                      fontSize: '0.9rem',
                      backgroundColor: mode === 'dark' ? '#bb86fc' : '#3f51b5',
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
                      color: mode === 'dark' ? '#ffffff' : '#000000',
                      borderColor: mode === 'dark' ? '#bb86fc' : '#3f51b5',
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
