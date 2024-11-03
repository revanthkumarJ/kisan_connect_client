import React, { useState } from 'react';
import { Box, Typography, Button, CardMedia, FormControl, InputLabel, Select, MenuItem, Snackbar, Alert } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProductDetailPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const product = location.state ? location.state.product : null;
  const { mode } = useAuth();

  // Extract quantity from the URL query parameters if provided
  const queryParams = new URLSearchParams(location.search);
  const initialQuantity = parseInt(queryParams.get('quantity'), 10) || 1;

  const [quantity, setQuantity] = useState(initialQuantity);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Redirect if product is not found
  if (!product) {
    return <Typography variant="h6">Product not found.</Typography>;
  }

  const handleAddToCart = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setSnackbar({ open: true, message: 'Please log in to add items to the cart.', severity: 'warning' });
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/user/addCartItem", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        },
        body: JSON.stringify({
          productId: product._id,
          quantity: quantity,
        }),
      });

      if (response.ok) {
        setSnackbar({ open: true, message: `Successfully added ${quantity} ${product.unit} of ${product.productName} to the cart.`, severity: 'success' });
      } else {
        const errorData = await response.json();
        setSnackbar({ open: true, message: `Failed to add to cart: ${errorData.message || "Unknown error"}`, severity: 'error' });
      }
    } catch (error) {
      setSnackbar({ open: true, message: `Error adding to cart: ${error.message}`, severity: 'error' });
    }
  };

  const handleBuyNow = () => {
    navigate(`/place-order?productId=${product._id}&quantity=${quantity}`);
  };

  const totalPrice = (quantity * product.price).toFixed(2);

  const pageStyles = {
    backgroundColor: mode === 'light' ? '#f5f5f5' : '#303030',
    color: mode === 'light' ? '#000' : '#fff',
    height:"85vh"
  };

  const cardStyles = {
    backgroundColor: mode === 'light' ? '#fff' : '#424242',
    color: mode === 'light' ? '#000' : '#fff',
  };

  return (
    <Box sx={{ padding: '2rem', ...pageStyles }}>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: '2rem' }}>
        <Box sx={{ flex: '1' }}>
          <CardMedia
            component="img"
            image={`data:image/png;base64,${product.image}`}
            alt={product.productName}
            sx={{
              height: '100%',
              objectFit: 'cover',
              borderRadius: '8px',
              transition: 'transform 0.3s, box-shadow 0.3s',
              '&:hover': {
                transform: 'scale(1.05)',
                boxShadow: mode === 'light' ? '0 8px 30px rgba(0, 0, 0, 0.2)' : '0 8px 30px rgba(255, 255, 255, 0.2)',
              }
            }}
          />
        </Box>

        <Box
          sx={{
            flex: '1',
            padding: '1.5rem',
            borderRadius: '8px',
            boxShadow: 3,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '100%',
            ...cardStyles,
          }}
        >
          <Box>
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
              {product.productName}
            </Typography>
            <Typography variant="body1" sx={{color: mode === 'light' ? '#000' : '#fff'}} gutterBottom>
              {product.description}
            </Typography>
            <Typography variant="h5" component="h2" gutterBottom sx={{ color: '#f44336' }}>
              RS. {product.price.toFixed(2)} per {product.unit}
            </Typography>
            <Typography variant="body1">
              Category: {product.category}
            </Typography>
            <Typography variant="body1">
              Stock: {product.stock}
            </Typography>
            <Typography variant="body1">
              Harvest Date: {new Date(product.harvestDate).toLocaleDateString()}
            </Typography>
            <Typography variant="body1">
              Expiry Date: {new Date(product.expiryDate).toLocaleDateString()}
            </Typography>
            <Typography variant="body1">
              Farming Method: {product.farmingMethod}
            </Typography>
            <Typography variant="body1">
              Delivery Time: {product.deliveryTime}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '1rem' }}>
            <FormControl variant="outlined" size="small" sx={{ marginRight: '1rem', minWidth: 120 }}>
              <InputLabel id="quantity-label">Quantity</InputLabel>
              <Select
                labelId="quantity-label"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                label="Quantity"
              >
                {Array.from({ length: product.stock }, (_, i) => i + 1).map((num) => (
                  <MenuItem key={num} value={num}>
                    {num}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
              {product.unit}
            </Typography>
          </Box>

          <Typography variant="h6" component="div" sx={{ marginTop: '1rem', fontWeight: 'bold' }}>
            Total Price: RS.{totalPrice}
          </Typography>

          <Box sx={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddToCart}
              sx={{ flex: 1, '&:hover': { backgroundColor: '#1976d2' } }}
            >
              Add to Cart
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleBuyNow}
              sx={{ flex: 1, '&:hover': { backgroundColor: '#d32f2f' } }}
            >
              Buy Now
            </Button>
          </Box>
        </Box>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProductDetailPage;
