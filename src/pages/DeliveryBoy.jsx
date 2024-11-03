import React, { useEffect, useState } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Snackbar,
  Alert,
  useTheme,
} from '@mui/material';
import axios from 'axios';
import { useAuth } from './AuthContext';

const DeliveryBoy = () => {
  const [deliveryItems, setDeliveryItems] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const { mode } = useAuth();
  const theme = useTheme();

  // Fetch delivery items on component mount
  useEffect(() => {
    const fetchDeliveryItems = async () => {
      try {
        const response = await axios.get('http://localhost:3000/user/getAllDeliveryItems', {
          headers: {
            'auth-token': localStorage.getItem('token'),
          },
        });
        setDeliveryItems(response.data);
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching delivery items:', error);
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
            'auth-token': localStorage.getItem('token'),
          },
        }
      );

      // Remove the delivered item from the UI
      setDeliveryItems(deliveryItems.filter((item) => !(item.userId === userId && item.productId === productId)));

      // Show success snackbar
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error marking item as delivered:', error);
    }
  };

  // Handle snackbar close
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box
      p={3}
      sx={{
        backgroundColor: mode === 'dark' ? theme.palette.grey[900] : theme.palette.grey[100],
        minHeight: '100vh',
        color: mode === 'dark' ? theme.palette.common.white : theme.palette.common.black,
      }}
    >
      <Typography variant="h4" gutterBottom>
        Delivery Orders
      </Typography>
      <Grid container spacing={3}>
        {deliveryItems.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item._id}>
            <Card
              sx={{
                backgroundColor: mode === 'dark' ? theme.palette.grey[800] : theme.palette.common.white,
                color: mode === 'dark' ? theme.palette.common.white : theme.palette.text.primary,
                boxShadow: mode === 'dark' ? '0 4px 8px rgba(255, 255, 255, 0.1)' : '0 4px 8px rgba(0, 0, 0, 0.1)',
              }}
            >
              <CardContent>
                <Typography variant="h6" color="primary">
                  Delivery ID: {item._id}
                </Typography>
                <Typography variant="body1">
                  <strong>Address:</strong> {item.address.doorNo}, {item.address.area}, {item.address.landmark},{' '}
                  {item.address.district}, {item.address.state}, {item.address.pincode}
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
                    sx={{
                      backgroundColor: mode === 'dark' ? theme.palette.success.dark : theme.palette.success.main,
                      color: theme.palette.common.white,
                      '&:hover': {
                        backgroundColor: mode === 'dark' ? theme.palette.success.light : theme.palette.success.dark,
                      },
                    }}
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
        <Alert
          onClose={handleSnackbarClose}
          severity="success"
          sx={{
            width: '100%',
            backgroundColor: mode === 'dark' ? theme.palette.success.dark : theme.palette.success.main,
            color: theme.palette.common.white,
          }}
        >
          Delivery marked as delivered!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DeliveryBoy;
