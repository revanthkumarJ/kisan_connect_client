import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Box,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const DeliveredItemsPage = () => {
  const [deliveredItems, setDeliveredItems] = useState([]);
  const navigate = useNavigate();
  const { mode } = useAuth();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isLaptop = useMediaQuery(theme.breakpoints.up('md'));

  const handleCardClick = (product) => {
    navigate(`/product/${product.productName}`, { state: { product } });
  };

  useEffect(() => {
    const fetchDeliveredItems = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3000/user/getAllDeliveredItems', {
          headers: {
            'auth-token': token,
          },
        });

        const itemsWithDetails = await Promise.all(
          response.data[0].orderedItems.map(async (item) => {
            const productResponse = await axios.get(`http://localhost:3000/customer/getProduct/${item.productId._id}`);
            return { ...item, product: productResponse.data.item };
          })
        );

        setDeliveredItems(itemsWithDetails);
      } catch (error) {
        console.error('Error fetching delivered items:', error);
      }
    };

    fetchDeliveredItems();
  }, []);

  return (
    <Container
      maxWidth={false}
      style={{
        padding: '20px',
        margin: '0 auto',
        minHeight:'100vh',
        backgroundColor: mode === 'dark' ? '#121212' : '#f0f2f5',
        color: mode === 'dark' ? '#f5f5f5' : '#333',
      }}
    >
      <Typography variant="h4" align="center" gutterBottom style={{ color: mode === 'dark' ? '#ffffff' : '#000000' }}>
        Delivered Items
      </Typography>
      <Box
        display="flex"
        flexDirection="row"
        flexWrap="wrap"
        justifyContent="space-between"
        width="100%"
      >
        {deliveredItems.map((item) => (
          <Box
            key={item._id}
            sx={{
              display: 'flex',
              width: isMobile ? '100%' : isLaptop ? '48%' : '100%',
              marginBottom: '1.5rem',
              padding: '10px',
              cursor: 'pointer',
            }}
            onClick={() => handleCardClick(item.product)}
          >
            <Card
              sx={{
                display: 'flex',
                flexDirection: 'row',
                width: '100%',
                backgroundColor: mode === 'dark' ? '#1f1f1f' : '#ffffff',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                borderRadius: '8px',
                overflow: 'hidden',
              }}
            >
              <CardMedia
                component="img"
                alt={item.product.productName}
                image={`data:image/png;base64,${item.product.image}`}
                title={item.product.productName}
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
                  color: mode === 'dark' ? '#e0e0e0' : '#333',
                }}
              >
                <Box>
                  <Typography
                    variant="h6"
                    noWrap
                    sx={{ fontWeight: 'bold', marginBottom: '8px', color: '#28a745' }}
                  >
                    Delivered
                  </Typography>
                  <Typography variant="body1">
                    <strong>Product Name:</strong> {item.product.productName}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Product ID:</strong> {item.productId._id}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Price:</strong> ₹{item.product.price}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Quantity:</strong> {item.quantity}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Ordered Date:</strong> {new Date(item.orderedDate).toLocaleDateString()}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Ordered Time:</strong> {new Date(item.orderedDate).toLocaleTimeString()}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Amount:</strong> ₹{item.amount}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>
    </Container>
  );
};

export default DeliveredItemsPage;
