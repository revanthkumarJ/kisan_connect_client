import React, { useState, useEffect, useRef } from 'react';
import { Box, Card, CardMedia, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ProductPage = () => {
  const [products, setProducts] = useState({ fruits: [], vegetables: [], grains: [], dairy: [], others: [] });
  const navigate = useNavigate();
  const scrollRef = useRef({});

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

  const ProductRow = ({ category, title, products }) => (
    <Box 
      marginBottom="1rem" // Gap between each row
      sx={{ 
        width: '100%', 
        padding: '1rem', 
        backgroundColor: '#f9f9f9', // Slight whitish background
        borderRadius: '8px', // Rounded corners
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)', // Subtle shadow
        margin: '0 1rem', // Outer margin for better spacing
        marginBottom:"10px"
      }}
    >
      <Typography variant="h6" component="h2" gutterBottom sx={{ fontWeight: 'bold', color: '#333' }}>
        {title}
      </Typography>
      <Box display="flex" alignItems="center" sx={{ width: '100%' }}>
        {/* Products Row */}
        <Box
          ref={(el) => (scrollRef.current[category] = el)}
          sx={{
            display: 'flex',
            overflowX: 'auto',
            padding: '0',
            margin: '0',
            scrollBehavior: 'smooth',
            width: '100%',
            '&::-webkit-scrollbar': {
              display: 'none',
            },
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
                  boxShadow: 'none',
                }}
                onClick={() => handleCardClick(product)}
                onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.3)')}
                onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'none')}
              >
                <CardMedia
                  component="img"
                  height="140"
                  image={`data:image/jpeg;base64,${product.image}`} // Assuming base64 string is in 'image' field
                  alt={product.productName}
                />
                <Typography 
                  gutterBottom 
                  variant="subtitle1" 
                  component="div" 
                  sx={{ 
                    padding: '8px', 
                    fontWeight: 'bold', 
                    color: '#555',
                    textAlign: 'center' // Centering the title
                  }}
                >
                  {product.productName}
                </Typography>
                <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  sx={{ padding: '0 8px', textAlign: 'center' }} // Centering the price
                >
                  ${product.price.toFixed(2)} per {product.unit}
                </Typography>
              </Card>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ width: '100%', padding: '0', margin: '0', maxWidth: '100vw' }}>
      {Object.entries(products).map(([category, productList]) => (
        <ProductRow
          key={category}
          category={category}
          title={category.charAt(0).toUpperCase() + category.slice(1)} // Capitalize category title
          products={productList}
        />
      ))}
    </Box>
  );
};

export default ProductPage;
