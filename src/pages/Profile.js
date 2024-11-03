import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Button,
  Avatar,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Grid,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProfilePage = () => {
  const { mode, logout } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [updatedUser, setUpdatedUser] = useState(null);
  const navigate = useNavigate();

  // Define color schemes based on the mode
  const colors = {
    background: mode === 'dark' ? '#1E1E1E' : '#FFFFFF',
    text: mode === 'dark' ? '#FFFFFF' : '#000000',
    primary: mode === 'dark' ? '#90CAF9' : '#1976D2',
    secondary: mode === 'dark' ? '#F48FB1' : '#D32F2F',
    dialogBackground: mode === 'dark' ? '#333333' : '#FFFFFF',
  };

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
        setUser(userData);
        setUpdatedUser(userData);
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
    setDialogOpen(true);
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
        [name]: value,
      },
    }));
  };

  const handleUpdateUser = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.put('http://localhost:3000/user/updateUser', { user: updatedUser }, {
        headers: {
          'auth-token': token,
        },
      });
      setDialogOpen(false);
      window.location.reload();
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
    <Box sx={{ padding: '2rem', backgroundColor: colors.background ,height:"100vh"}}>
      <Card sx={{  marginRight: '1rem', backgroundColor: colors.dialogBackground }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', color: colors.text }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Avatar sx={{ width: 100, height: 100, marginBottom: 2 }} />
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {user.roles.isAdmin && <Typography variant="body1">Admin</Typography>}
                {user.roles.isDeliveryBoy && <Typography variant="body1">Delivery Boy</Typography>}
                {user.roles.isFarmer && <Typography variant="body1">Farmer</Typography>}
                {user.roles.isCustomer && <Typography variant="body1">Customer</Typography>}
              </Box>
            </Box>
            <Box sx={{ marginLeft: 2, color: colors.text }}>
              <Typography variant="h6">{user.name}</Typography>
              <Typography variant="body1">{user.phoneNumber}</Typography>
              <Typography variant="body1">{formattedAddress}</Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={handleEditClick}
                sx={{ marginTop: '1rem', backgroundColor: colors.primary }}
              >
                Edit
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleLogout}
                sx={{ marginTop: '1rem', backgroundColor: colors.secondary }}
              >
                Logout
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onClose={handleDialogClose} fullWidth>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent sx={{ backgroundColor: colors.dialogBackground }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={updatedUser?.name || ''}
                onChange={handleInputChange}
                InputLabelProps={{ style: { color: colors.text } }}
                sx={{ color: colors.text }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Phone Number"
                name="phoneNumber"
                value={updatedUser?.phoneNumber || ''}
                onChange={handleInputChange}
                InputLabelProps={{ style: { color: colors.text } }}
                sx={{ color: colors.text }}
              />
            </Grid>
            {/* Add more fields as needed */}
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
