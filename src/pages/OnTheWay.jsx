import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const OnTheWayPage = () => {
  const [onTheWayItems, setOnTheWayItems] = useState([]);
  const navigate = useNavigate();
  const { mode } = useAuth(); // mode (light or dark)

  const handleCardClick = (product) => {
    navigate(`/product/${product.productName}`, { state: { product } });
  };

  useEffect(() => {
    const fetchOnTheWayItems = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3000/user/getAllOnTheWay', {
          headers: {
            'auth-token': token,
          },
        });

        const itemsWithDetails = await Promise.all(
          response.data[0]?.onTheWayItems.map(async (item) => {
            const productResponse = await axios.get(
              `http://localhost:3000/customer/getProduct/${item.productId}`
            );
            return { ...item, product: productResponse.data.item };
          })
        );
        setOnTheWayItems(itemsWithDetails);
      } catch (error) {
        console.error('Error fetching on-the-way items:', error);
      }
    };

    fetchOnTheWayItems();
  }, []);

  // Define styles based on the current mode
  const styles = {
    container: {
      padding: '20px',
      height:"100vh",
      margin: '0 auto',
      color: mode === 'light' ? '#000' : '#fff',
      backgroundColor: mode === 'light' ? '#f0f0f0' : '#303030',
    },
    heading: {
      textAlign: 'center',
      marginBottom: '20px',
      color: mode === 'light' ? '#333' : '#ffcc00',
    },
    card: {
      border: mode === 'light' ? '1px solid #ddd' : '1px solid #555',
      borderRadius: '8px',
      padding: '16px',
      backgroundColor: mode === 'light' ? '#f9f9f9' : '#424242',
      color: mode === 'light' ? '#000' : '#fff',
      boxShadow: mode === 'light'
        ? '0 4px 12px rgba(0, 0, 0, 0.15)'
        : '0 4px 12px rgba(0, 0, 0, 0.3)',
      textAlign: 'center',
      transition: 'transform 0.2s ease-in-out',
      cursor: 'pointer',
    },
    onTheWayText: {
      color: mode === 'light' ? '#ff6600' : '#ffcc00',
      fontWeight: 'bold',
    },
    productName: {
      fontWeight: 'bold',
    },
    amount: {
      fontWeight: 'bold',
      color: mode === 'light' ? '#333' : '#ffcc00',
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>On The Way</h1>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: '20px',
        }}
      >
        {onTheWayItems.map((item) => (
          <div
            key={item._id}
            style={styles.card}
            onClick={() => handleCardClick(item.product)}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.03)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            {item.product && (
              <img
                src={`data:image/png;base64,${item.product.image}`}
                alt={item.product.productName}
                style={{
                  width: '100%',
                  height: '200px',
                  objectFit: 'cover',
                  borderRadius: '8px',
                  marginBottom: '10px',
                }}
              />
            )}
            <h3 style={styles.onTheWayText}>On the Way</h3>
            <p><strong>Product Name:</strong> {item.product?.productName || item.productName}</p>
            <p><strong>Quantity:</strong> {item.quantity}</p>
            <p><strong>Ordered Date:</strong> {new Date(item.orderedDate).toLocaleString()}</p>
            <p style={styles.amount}><strong>Amount:</strong> ₹{item.amount}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OnTheWayPage;
