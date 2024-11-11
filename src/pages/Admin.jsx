import React, { useState } from 'react';
import { Button, TextField, Typography, Card, CardContent, Snackbar, Alert, CircularProgress } from '@mui/material';
import { useAuth } from './AuthContext';
import axios from 'axios';
import { Navigate } from 'react-router-dom';

const AdminPage = () => {
  const { mode } = useAuth();
  const [email, setEmail] = useState('');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [redirect, setRedirect] = useState(null); // State to handle redirection

  const containerStyle = {
    backgroundColor: mode === 'light' ? '#f5f5f5' : '#121212',
    color: mode === 'light' ? '#000' : '#fff',
    padding: '20px',
    minHeight: '100vh',
  };

  const buttonStyle = {
    backgroundColor: mode === 'light' ? '#1976d2' : '#90caf9',
    color: '#fff',
    marginTop: '10px',
    marginRight: '10px',
  };

  const cardStyle = {
    backgroundColor: mode === 'light' ? '#fff' : '#333',
    color: mode === 'light' ? '#000' : '#fff',
    marginTop: '20px',
    padding: '10px',
  };
  const handleSearch = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token"); // Retrieve the token from localStorage
      // console.log(email);
  
      // Make a GET request, passing email as a query parameter
      const response = await axios.get('http://localhost:3000/admin/details/getUserById', {
        params: { email }, // Send the email as a query parameter
        headers: {
          'auth-token': token, // Add the auth-token to the request headers
          'Content-Type': 'application/json', // Ensure content type is application/json
        },
      });
  
      // console.log(response);
      if (response.data.length > 0) {
        setUser(response.data[0]);
      } else {
        setSnackbarMessage('User not found.');
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      setSnackbarMessage('Error fetching user details.');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };
  
  const handleDeliveryStatus = async () => {
    const token=localStorage.getItem("token")
    if (user?.roles?.isDeliveryBoy) {
      // Remove as Delivery Boy
      try {
        await axios.put('http://localhost:3000/admin/deliveryBoy/removeDeliveryBoy', { id: user._id },{headers: {
          'auth-token': token, // Add the auth-token to the request headers
          'Content-Type': 'application/json', // Ensure content type is application/json
        }});
        setUser(prevUser => ({
          ...prevUser,
          roles: { ...prevUser.roles, isDeliveryBoy: false },
        }));
        setSnackbarMessage('User removed as Delivery Boy.');
        setSnackbarOpen(true);
      } catch (error) {
        console.error('Error removing delivery boy:', error);
        setSnackbarMessage('Error removing delivery boy.');
        setSnackbarOpen(true);
      }
    } else {
      // Make as Delivery Boy
      try {
        await axios.put('http://localhost:3000/admin/deliveryBoy/makeDeliveryBoy', { id: user._id },{headers: {
          'auth-token': token, // Add the auth-token to the request headers
          'Content-Type': 'application/json', // Ensure content type is application/json
        }});
        setUser(prevUser => ({
          ...prevUser,
          roles: { ...prevUser.roles, isDeliveryBoy: true },
        }));
        setSnackbarMessage('User made as Delivery Boy.');
        setSnackbarOpen(true);
      } catch (error) {
        console.error('Error making delivery boy:', error);
        setSnackbarMessage('Error making delivery boy.');
        setSnackbarOpen(true);
      }
    }
  };

  if (redirect) {
    return <Navigate to={redirect} replace />;
  }

  return (
    <div style={containerStyle}>
      <Typography variant="h4" component="h1" style={{ textAlign: 'center', marginBottom: '20px' }}>
        Admin Panel
      </Typography>

      <div style={{ textAlign: 'center' }}>
        <Button
          style={buttonStyle}
          onClick={() => setRedirect('/mangeCoursels')} // Redirect to Manage Carousels
        >
          Manage Carousels
        </Button>
        <Button
          style={buttonStyle}
          onClick={() => setRedirect('/ManageFarmerRequests')} // Redirect to Manage Farmer Requests
        >
          Manage Farmer Requests
        </Button>
      </div>

      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <TextField
          label="Search by Email"
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: '300px' }}
        />
        <Button
          style={buttonStyle}
          onClick={handleSearch}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} style={{ color: '#fff' }} /> : 'Search'}
        </Button>
      </div>

      {user && (
        <Card style={cardStyle}>
          <CardContent>
            <Typography variant="h6">{user.name}</Typography>
            <Typography variant="body1">Email: {user.email}</Typography>
            <Typography variant="body1">Phone: {user.phoneNumber}</Typography>
            <Typography variant="body1">Address: {`${user.address.doorNo}, ${user.address.area}, ${user.address.landmark}, ${user.address.district}, ${user.address.state}, ${user.address.pincode}`}</Typography>
            <Typography variant="body1">Roles:</Typography>
            <Typography variant="body2">
              {user.roles.isAdmin ? 'Admin ' : ''}
              {user.roles.isDeliveryBoy ? 'Delivery Boy ' : ''}
              {user.roles.isFarmer ? 'Farmer ' : ''}
              {user.roles.isCustomer ? 'Customer ' : ''}
            </Typography>
            <Button
              style={buttonStyle}
              onClick={handleDeliveryStatus}
            >
              {user.roles.isDeliveryBoy ? 'Remove as Delivery Boy' : 'Make as Delivery Boy'}
            </Button>
          </CardContent>
        </Card>
      )}

      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={() => setSnackbarOpen(false)}>
        <Alert onClose={() => setSnackbarOpen(false)} severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default AdminPage;
