import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Box, Grid, Card, CardMedia, Typography, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const SearchResults = () => {
  const [products, setProducts] = useState([]);
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
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
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
                  boxShadow: 'none',
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
                  }}
                >
                  {product.productName}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ padding: '0 8px', textAlign: 'center' }}
                >
                  ${product.price.toFixed(2)} per {product.unit}
                </Typography>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography variant="h6">No products found.</Typography>
        )}
      </Grid>
    </Box>
  );
};

export default SearchResults;
