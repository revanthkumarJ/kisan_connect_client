import React, { useEffect, useState } from 'react';
import { Grid, Card, CardContent, Typography, Button, Box, Snackbar, Alert } from '@mui/material';
import axios from 'axios';

const DeliveryBoy = () => {
  const [deliveryItems, setDeliveryItems] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  // Fetch delivery items on component mount
  useEffect(() => {
    const fetchDeliveryItems = async () => {
      try {
        const response = await axios.get('http://localhost:3000/user/getAllDeliveryItems', {
          headers: {
            'auth-token': localStorage.getItem('token')
          }
        });
        setDeliveryItems(response.data);
        console.log(response.data)
      } catch (error) {
        console.error("Error fetching delivery items:", error);
      }
    };
    
    fetchDeliveryItems();
  }, []);

  // Handle "Delivered" button click
  const handleDelivered = async (userId, productId) => {
    try {
      await axios.post(
        'http://localhost:3000/user/orderDelivered',
        { userId, productId },
        {
          headers: {
            'auth-token': localStorage.getItem('token')
          }
        }
      );

      // Remove the delivered item from the UI
      setDeliveryItems(deliveryItems.filter(item => !(item.userId === userId && item.productId === productId)));
      
      // Show success snackbar
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error marking item as delivered:", error);
    }
  };

  // Handle snackbar close
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>Delivery Orders</Typography>
      <Grid container spacing={3}>
        {deliveryItems.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item._id}>
            <Card>
              <CardContent>
                <Typography variant="h6" color="primary">
                  Delivery ID: {item._id}
                </Typography>
                <Typography variant="body1">
                  <strong>Address:</strong> {item.address.doorNo}, {item.address.area}, {item.address.landmark}, {item.address.district}, {item.address.state}, {item.address.pincode}
                </Typography>
                <Typography variant="body1">
                  <strong>Quantity:</strong> {item.quantity}
                </Typography>
                <Typography variant="body1">
                  <strong>Amount:</strong> ₹{item.amount}
                </Typography>
                <Box mt={2}>
                  <Button
                    variant="contained"
                    color="success"
                    fullWidth
                    onClick={() => handleDelivered(item.userId, item.productId)}
                  >
                    Delivered
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Snackbar for feedback */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
          Delivery marked as delivered!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DeliveryBoy;
