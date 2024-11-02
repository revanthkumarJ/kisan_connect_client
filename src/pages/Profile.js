import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, Button, Avatar, Card, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProfilePage = () => {
  const { login, logout, isLoggedIn } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [updatedUser, setUpdatedUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('http://localhost:3000/user/getUser', {
          headers: {
            'auth-token': token,
          },
        });
        
        const userData = response.data;
        console.log(userData)
        setUser(userData);
        setUpdatedUser(userData); // Set initial form values
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
    logout();
    navigate('/login');
  };

  const handleEditClick = () => {
    setDialogOpen(true); // Open dialog on Edit button click
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedUser((prev) => ({
      ...prev,
      [name]: value,
      address: {
        ...prev.address,
        [name]: value, // For nested address fields
      },
    }));
  };

  const handleUpdateUser = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.put('http://localhost:3000/user/updateUser', {"user":updatedUser}, {
        headers: {
          'auth-token': token,
        },
      });
      setDialogOpen(false); // Close dialog after update
      window.location.reload(); // Reload the page to show updated data
    } catch (error) {
      console.error('Failed to update user data', error);
      setError('Failed to update user data');
    }
  };

  if (loading) return <Typography variant="h6">Loading...</Typography>;
  if (error) return <Typography variant="h6">{error}</Typography>;
  if (!user) return <Typography variant="h6">User not found.</Typography>;

  const formattedAddress = `${user.address.doorNo}, ${user.address.area}, ${user.address.district}, ${user.address.pincode} ${user.address.landmark}, ${user.address.state}`;

  return (
    <Box sx={{ padding: '2rem', display: 'flex', justifyContent: 'space-between' }}>
      <Card sx={{ flex: 1, marginRight: '1rem' }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Avatar sx={{ width: 100, height: 100, marginBottom: 2 }} /> {/* Placeholder for user image */}
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {user.roles.isAdmin && <Typography variant="body1">Admin</Typography>}
                {user.roles.isDeliveryBoy && <Typography variant="body1">Delivery Boy</Typography>}
                {user.roles.isFarmer && <Typography variant="body1">Farmer</Typography>}
                {user.roles.isCustomer && <Typography variant="body1">Customer</Typography>}
              </Box>
            </Box>
            <Box sx={{ marginLeft: 2 }}>
              <Typography variant="h6">{user.name}</Typography>
              <Typography variant="body1">{user.phoneNumber}</Typography>
              <Typography variant="body1">{formattedAddress}</Typography>
              <Button variant="contained" color="primary" onClick={handleEditClick} sx={{ marginTop: '1rem' }}>
                Edit
              </Button>
              <Button variant="contained" color="secondary" onClick={handleLogout} sx={{ marginTop: '1rem' }}>
                Logout
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onClose={handleDialogClose} fullWidth>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={updatedUser?.name || ''}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Phone Number"
                name="phoneNumber"
                value={updatedUser?.phoneNumber || ''}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Door No"
                name="doorNo"
                value={updatedUser?.address?.doorNo || ''}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Area"
                name="area"
                value={updatedUser?.address?.area || ''}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="District"
                name="district"
                value={updatedUser?.address?.district || ''}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="State"
                name="state"
                value={updatedUser?.address?.state || ''}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Pincode"
                name="pincode"
                value={updatedUser?.address?.pincode || ''}
                onChange={handleInputChange}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleUpdateUser} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProfilePage;
