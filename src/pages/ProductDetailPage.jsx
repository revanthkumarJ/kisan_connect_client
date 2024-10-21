
import React, { useState } from 'react';
import { Box, Typography, Button, CardMedia, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useLocation } from 'react-router-dom';

const ProductDetailPage = () => {
  const location = useLocation();
  const product = location.state ? location.state.product : null;
  const [quantity, setQuantity] = useState(1);

  // Redirect if product is not found
  if (!product) {
    return <Typography variant="h6">Product not found.</Typography>;
  }

  const handleAddToCart = () => {
    console.log(`Adding ${quantity} ${product.unit} of ${product.productName} to cart.`);
  };

  const handleBuyNow = () => {
    console.log(`Buying ${quantity} ${product.unit} of ${product.productName}.`);
  };

  // Calculate total price based on quantity selected
  const totalPrice = (quantity * product.price).toFixed(2);

  return (
    <Box sx={{ padding: '2rem', backgroundColor: '#f5f5f5' }}>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: '2rem' }}>
        
        {/* Left Side - Product Image */}
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
                boxShadow: '0 8px 30px rgba(0, 0, 0, 0.2)',
              },
            }}
          />
        </Box>

        {/* Right Side - Product Details */}
        <Box
          sx={{
            flex: '1',
            padding: '1.5rem',
            backgroundColor: '#fff',
            borderRadius: '8px',
            boxShadow: 3,
            display: 'flex',
            flexDirection: 'column',   // Make sure content stacks vertically
            justifyContent: 'space-between',  // Adjust spacing between content
            minHeight: '100%',  // Set minHeight to ensure it matches image height
          }}
        >
          <Box>
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
              {product.productName}
            </Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              {product.description}
            </Typography>
            <Typography variant="h5" component="h2" gutterBottom sx={{ color: '#f44336' }}>
              RS. ${product.price.toFixed(2)} per {product.unit}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Category: {product.category}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Stock: {product.stock}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Harvest Date: {new Date(product.harvestDate).toLocaleDateString()}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Expiry Date: {new Date(product.expiryDate).toLocaleDateString()}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Farming Method: {product.farmingMethod}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Delivery Time: {product.deliveryTime}
            </Typography>
          </Box>

          {/* Quantity Selector and Total Price */}
          <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '1rem' }}>
            <FormControl variant="outlined" size="small" sx={{ marginRight: '1rem', minWidth: 120 }}>
              <InputLabel id="quantity-label">Quantity</InputLabel>
              <Select
                labelId="quantity-label"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)} // Update quantity state
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

          {/* Display Total Price */}
          <Typography variant="h6" component="div" sx={{ marginTop: '1rem', fontWeight: 'bold' }}>
            Total Price: RS.{totalPrice}
          </Typography>

          {/* Add to Cart and Buy Now Buttons */}
          <Box sx={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddToCart}
              sx={{ flex: 1, '&:hover': { backgroundColor: '#1976d2' } }} // Darken color on hover
            >
              Add to Cart
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleBuyNow}
              sx={{ flex: 1, '&:hover': { backgroundColor: '#d32f2f' } }} // Darken color on hover
            >
              Buy Now
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ProductDetailPage;



