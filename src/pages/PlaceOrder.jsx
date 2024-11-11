import React, { useEffect, useState } from 'react';
import { Container, Typography, Button, Snackbar, Alert, Box, CircularProgress, TextField, Card, CardContent, CardMedia } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const PlaceOrderPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState(null);
  const [orderStatus, setOrderStatus] = useState(null);
  const [stock, setStock] = useState(0);

  // Get `productId` and `quantity` from URL query parameters
  const searchParams = new URLSearchParams(location.search);
  const productId = searchParams.get('productId');
  const initialQuantity = parseInt(searchParams.get('quantity'), 10) || 1;

  // Initialize quantity with value from URL, or 1 if not specified
  const [quantity, setQuantity] = useState(initialQuantity);

  useEffect(() => {
    const fetchUser = () => {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      if (storedUser) {
        setUser(storedUser);
        if (!storedUser.address) {
          setSnackbarOpen(true);
        }
      } else {
        setSnackbarOpen(true);
      }
    };

    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/customer/getProduct/${productId}`);
        if (response.data.message === "Product retrieved successfully") {
          setProduct(response.data.item);
          setStock(response.data.item.stock);

          // Adjust quantity to stock if initial quantity exceeds available stock
          if (initialQuantity > response.data.item.stock) {
            setQuantity(response.data.item.stock);
          }
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchUser();
    fetchProduct();
  }, [productId, initialQuantity]);

  const handleQuantityChange = (event) => {
    const value = Math.max(1, Math.min(event.target.value, stock)); // Ensure quantity is between 1 and stock
    setQuantity(value);
  };

  const placeOrder = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:3000/user/placeOrder',
        { productId, quantity: parseInt(quantity, 10) },
        {
          headers: {
            'auth-token': token,
          },
        }
      );

      if (response.status === 200) {
        setOrderStatus('Order placed successfully!');
        await axios.delete(`http://localhost:3000/user/deleteCardItem/${productId}`, {
          headers: {
            'auth-token': `${token}`,
          },
        });

        // Delay navigation by 3 seconds after successful order placement
        setTimeout(() => {
          navigate('/');
        }, 1000);
      } else {
        setOrderStatus('Failed to place order. Please try again.');
      }
    } catch (error) {
      console.error(error);
      setOrderStatus('Failed to place order. Please try again.');
    }
    setLoading(false);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleUpdateProfile = () => {
    navigate('/profile'); // Redirect to profile page to update address
  };

  const totalPrice = product ? product.price * quantity : 0;

  return (
    <Container>
      {product ? (
        <Card sx={{ display: 'flex', marginTop: 4, padding: 2 }}>
          <CardMedia
            component="img"
            sx={{ width: 120, height: 120 }}
            image={`data:image/jpeg;base64,${product.image}`} // Display base64 image
            alt={product.productName}
          />
          <CardContent sx={{ flex: 1 }}>
            <Typography variant="h5" sx={{ marginBottom: 2 }}>Order Details</Typography>
            <Box sx={{ marginBottom: 2 }}>
              <Typography variant="body1"><strong>Product:</strong> {product.productName}</Typography>
              <Typography variant="body1"><strong>Category:</strong> {product.category}</Typography>
              <Typography variant="body1"><strong>Price per unit:</strong> ₹{product.price}</Typography>
              <Typography variant="body1"><strong>Available stock:</strong> {stock}</Typography>
              <TextField
                type="number"
                label="Quantity"
                value={quantity}
                onChange={handleQuantityChange}
                inputProps={{ min: 1, max: stock }}
                sx={{ margin: '20px 0', width: '100px' }}
              />
              <Typography variant="body1"><strong>Total Price:</strong> ₹{totalPrice}</Typography>
            </Box>

            <Typography variant="h6">User Details</Typography>
            <Box sx={{ marginBottom: '20px' }}>
              <Typography variant="body1"><strong>Name:</strong> {user?.name}</Typography>
              <Typography variant="body1"><strong>Phone:</strong> {user?.phoneNumber}</Typography>
              <Typography variant="body1">
                <strong>Address:</strong> {user?.address ? `${user.address.doorNo}, ${user.address.area}, ${user.address.landmark}, ${user.address.district}, ${user.address.state} - ${user.address.pincode}` : 'No Address Provided'}
              </Typography>
            </Box>

            <Typography>
                If you want to change delivery details you can edit in profile section
            </Typography>

            {user?.address ? (
              <Button variant="contained" color="primary" onClick={placeOrder} disabled={loading}>
                {loading ? <CircularProgress size={24} /> : 'Proceed'}
              </Button>
            ) : (
              <Typography variant="body2" color="error" sx={{ marginBottom: 2 }}>
                Please update your address in profile to proceed.
              </Typography>
            )}
            <Button variant="text" onClick={handleUpdateProfile} sx={{ marginTop: 1 }}>
              Update in Profile
            </Button>

            {orderStatus && (
              <Typography variant="h6" sx={{ marginTop: 2 }}>
                {orderStatus}
              </Typography>
            )}
          </CardContent>
        </Card>
      ) : (
        <CircularProgress sx={{ marginTop: 4 }} />
      )}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity="warning" sx={{ width: '100%' }}>
          Please update your address in profile to proceed.
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default PlaceOrderPage;
