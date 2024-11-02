import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, Button, Avatar, Card, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // Use useNavigate instead of useHistory
import { useAuth } from './AuthContext';

const ProfilePage = () => {
  const { login, logout, isLoggedIn } = useAuth();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Use useNavigate for navigation

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('http://localhost:3000/user/getUser', {
          headers: {
            'auth-token': token,
          },
        });
        setUser(response.data);
      } catch (error) {
        setError('Failed to fetch user data');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    logout()
    navigate('/login'); // Redirect to login page
  };

  if (loading) return <Typography variant="h6">Loading...</Typography>;
  if (error) return <Typography variant="h6">{error}</Typography>;
  if (!user) return <Typography variant="h6">User not found.</Typography>;

  const formattedAddress = (user?.address)?`
    ${user.address.doorNo},
    ${user.address.area},
    ${user.address.district}, ${user.address.pincode}
    ${user.address.landmark},
    ${user.address.state}
  `:"No Address Provided"
  ;

  return (
    <Box sx={{ padding: '2rem', display: 'flex', justifyContent: 'space-between' }}>
      <Card sx={{ flex: 1, marginRight: '1rem' }}>
        <CardContent>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: 'flex',flexDirection: 'column', alignItems: 'center' }}>
              <Avatar sx={{ width: 100, height: 100, marginBottom: 2 }} /> {/* Placeholder for user image */}
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {/* Display roles without the "Roles:" text */}
                {user.roles.isAdmin && <Typography variant="body1">Admin</Typography>}
                {user.roles.isDeliveryBoy && <Typography variant="body1">Delivery Boy</Typography>}
                {user.roles.isFarmer && <Typography variant="body1">Farmer</Typography>}
                {user.roles.isCustomer && <Typography variant="body1">Customer</Typography>}
              </Box>
            </Box>
            <Box sx={{ marginLeft: 2 }}>
              <Typography variant="h6">{user.name}</Typography>
              <Typography variant="body1">{user.email}</Typography>
              <Typography variant="body1">{user.phoneNumber}</Typography>
              <Typography variant="body1">{formattedAddress}</Typography>
              <Button variant="contained" color="primary" onClick={handleLogout} sx={{ marginTop: '1rem' }}>
                Logout
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>


    </Box>
  );
};

export default ProfilePage;
