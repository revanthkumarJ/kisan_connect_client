import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Box, Grid, Card, CardMedia, Typography, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const SearchResults = () => {
  const [products, setProducts] = useState([]);
  const { mode } = useAuth();
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('query');
  const navigate = useNavigate();

  const handleCardClick = (product) => {
    navigate(`/product/${product.productName}`, { state: { product } });
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`http://localhost:3000/customer/getAllProductsByName?name=${query}`);
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching search results:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [query]);

  if (loading) return <CircularProgress />;

  return (
    <Box
      sx={{
        padding: 3,
        backgroundColor: mode === 'dark' ? '#121212' : '#ffffff',
        color: mode === 'dark' ? '#ffffff' : '#000000',
      }}
    >
      <Typography variant="h4" gutterBottom sx={{ color: mode === 'dark' ? '#ffffff' : '#000000' }}>
        Search Results for "{query}"
      </Typography>
      <Grid container spacing={3}>
        {products.length > 0 ? (
          products.map((product) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
              <Card
                sx={{
                  transition: '0.3s',
                  cursor: 'pointer',
                  boxShadow: mode === 'dark' ? '0px 4px 8px rgba(255, 255, 255, 0.1)' : '0px 4px 8px rgba(0, 0, 0, 0.1)',
                  backgroundColor: mode === 'dark' ? '#333333' : '#ffffff',
                  color: mode === 'dark' ? '#ffffff' : '#000000',
                  '&:hover': {
                    boxShadow: mode === 'dark' ? '0px 4px 12px rgba(255, 255, 255, 0.2)' : '0px 4px 12px rgba(0, 0, 0, 0.2)',
                  },
                }}
                onClick={() => handleCardClick(product)}
              >
                <CardMedia
                  component="img"
                  height="220"
                  image={`data:image/jpeg;base64,${product.image}`}
                  alt={product.productName}
                />
                <Typography
                  gutterBottom
                  variant="subtitle1"
                  sx={{
                    padding: '8px',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    color: mode === 'dark' ? '#ffffff' : '#000000',
                  }}
                >
                  {product.productName}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ padding: '0 8px', textAlign: 'center', color: mode === 'dark' ? '#bbbbbb' : '#555555' }}
                >
                  ${product.price.toFixed(2)} per {product.unit}
                </Typography>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography variant="h6" sx={{ color: mode === 'dark' ? '#ffffff' : '#000000' }}>
            No products found.
          </Typography>
        )}
      </Grid>
    </Box>
  );
};

export default SearchResults;
