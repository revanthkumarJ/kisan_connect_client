import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const OnTheWayPage = () => {
  const [onTheWayItems, setOnTheWayItems] = useState([]);
  const navigate = useNavigate();

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

  return (
    <div style={{ padding: '20px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>On The Way</h1>
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
            style={{
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '16px',
              backgroundColor: '#f9f9f9',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              textAlign: 'center',
              transition: 'transform 0.2s ease-in-out',
              cursor: 'pointer',
            }}
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
            <h3 style={{ color: '#ff6600', fontWeight: 'bold' }}>On the Way</h3>
            <p><strong>Product Name:</strong> {item.product?.productName || item.productName}</p>
            <p><strong>Quantity:</strong> {item.quantity}</p>
            <p><strong>Ordered Date:</strong> {new Date(item.orderedDate).toLocaleString()}</p>
            <p><strong>Amount:</strong> ₹{item.amount}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OnTheWayPage;
