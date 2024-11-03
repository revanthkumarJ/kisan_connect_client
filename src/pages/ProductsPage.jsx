import React, { useState, useEffect, useRef } from 'react';
import { Box, Card, CardMedia, Typography, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useAuth } from './AuthContext';

const ProductPage = () => {
  const [products, setProducts] = useState({ fruits: [], vegetables: [], grains: [], dairy: [], others: [] });
  const navigate = useNavigate();
  const scrollRef = useRef({});
  const { mode } = useAuth();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const fruitResponse = await fetch('http://localhost:3000/customer/getAllFruits');
        const vegetableResponse = await fetch('http://localhost:3000/customer/getAllVegetables');
        const grainResponse = await fetch('http://localhost:3000/customer/getAllGrains');
        const dairyResponse = await fetch('http://localhost:3000/customer/getAllDairy');
        const otherResponse = await fetch('http://localhost:3000/customer/getAllOthers');

        const fruits = await fruitResponse.json();
        const vegetables = await vegetableResponse.json();
        const grains = await grainResponse.json();
        const dairy = await dairyResponse.json();
        const others = await otherResponse.json();

        setProducts({ fruits, vegetables, grains, dairy, others });
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    };

    fetchProducts();
  }, []);

  const handleCardClick = (product) => {
    navigate(`/product/${product.productName}`, { state: { product } });
  };

  const scrollLeft = (category) => {
    scrollRef.current[category].scrollLeft -= 200;
  };

  const scrollRight = (category) => {
    scrollRef.current[category].scrollLeft += 200;
  };

  const ProductRow = ({ category, title, products }) => (
    <Box 
      sx={{ 
        width: '96%', 
        padding: '1rem', 
        backgroundColor: mode === 'light' ? '#f0f0f0' : '#1b1b2f', // Dark bluish background
        borderRadius: '8px', 
        boxShadow: mode === 'light' ? '0 2px 5px rgba(0, 0, 0, 0.1)' : '0 4px 10px rgba(0, 0, 0, 0.5)', // Heavier shadow in dark mode
        margin: '0 1rem 10px',
        position: 'relative'
      }}
    >
      <Typography 
        variant="h6" 
        component="h2" 
        gutterBottom 
        sx={{ 
          fontWeight: 'bold', 
          color: mode === 'light' ? '#333' : '#c7d2fe'  // Light blue for dark mode text
        }}
      >
        {title}
      </Typography>

      {/* Left Scroll Button */}
      <IconButton
        onClick={() => scrollLeft(category)}
        sx={{
          position: 'absolute',
          left: 0,
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 1,
          backgroundColor: mode === 'light' ? 'white' : '#121212',
          color: mode === 'light' ? '#333' : '#c7d2fe',
          boxShadow: mode === 'light' ? '0 2px 4px rgba(0,0,0,0.3)' : '0 2px 5px rgba(0,0,0,0.7)',
          '&:hover': { backgroundColor: mode === 'light' ? '#f0f0f0' : '#1c1c1e' },
        }}
      >
        <ArrowBackIosIcon />
      </IconButton>

      {/* Products Row */}
      <Box
        ref={(el) => (scrollRef.current[category] = el)}
        sx={{
          display: 'flex',
          overflowX: 'auto',
          scrollBehavior: 'smooth',
          marginX: '2rem',
          '&::-webkit-scrollbar': { display: 'none' },
          msOverflowStyle: 'none',
          scrollbarWidth: 'none',
        }}
      >
        {products.map((product) => (
          <Box key={product._id} marginRight="1rem">
            <Card
              sx={{
                width: 200,
                transition: '0.3s',
                cursor: 'pointer',
                boxShadow: mode === 'light' ? 'none' : '0 4px 20px rgba(0, 0, 0, 0.8)',
                backgroundColor: mode === 'light' ? '#fff' : '#24243e',
                '&:hover': {
                  boxShadow: '0 6px 25px rgba(0,0,0,0.6)',
                },
              }}
              onClick={() => handleCardClick(product)}
            >
              <CardMedia
                component="img"
                height="140"
                image={`data:image/jpeg;base64,${product.image}`}
                alt={product.productName}
              />
              <Typography 
                gutterBottom 
                variant="subtitle1" 
                component="div" 
                sx={{ 
                  padding: '8px', 
                  fontWeight: 'bold', 
                  color: mode === 'light' ? '#555' : '#e0e0e0',
                  textAlign: 'center'
                }}
              >
                {product.productName}
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  padding: '0 8px', 
                  color: mode === 'light' ? 'text.secondary' : '#b0bec5', 
                  textAlign: 'center' 
                }} 
              >
                ${product.price.toFixed(2)} per {product.unit}
              </Typography>
            </Card>
          </Box>
        ))}
      </Box>

      {/* Right Scroll Button */}
      <IconButton
        onClick={() => scrollRight(category)}
        sx={{
          position: 'absolute',
          right: 0,
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 1,
          backgroundColor: mode === 'light' ? 'white' : '#121212',
          color: mode === 'light' ? '#333' : '#c7d2fe',
          boxShadow: mode === 'light' ? '0 2px 4px rgba(0,0,0,0.3)' : '0 2px 5px rgba(0,0,0,0.7)',
          '&:hover': { backgroundColor: mode === 'light' ? '#f0f0f0' : '#1c1c1e' },
        }}
      >
        <ArrowForwardIosIcon />
      </IconButton>
    </Box>
  );

  return (
    <Box 
      sx={{ 
        width: '100%', 
        padding: '0', 
        margin: '0', 
        maxWidth: '100vw', 
        backgroundColor: mode === 'light' ? '#fafafa' : '#121212',
        color: mode === 'light' ? '#333' : '#e0e0e0'
      }}
    >
      {Object.entries(products).map(([category, productList]) => (
        <ProductRow
          key={category}
          category={category}
          title={category.charAt(0).toUpperCase() + category.slice(1)}
          products={productList}
        />
      ))}
    </Box>
  );
};

export default ProductPage;
