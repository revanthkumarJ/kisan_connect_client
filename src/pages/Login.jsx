import React, { useState } from 'react';
import { Container, Tab, Tabs, TextField, Button, Typography, Box, Snackbar } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const LoginPage = () => {
  const { login, logout, isLoggedIn } = useAuth();

  const [activeTab, setActiveTab] = useState(0); // 0 for Sign In, 1 for Sign Up
  const [signInData, setSignInData] = useState({ email: '', password: '' });
  const [signUpData, setSignUpData] = useState({ name: '', email: '', password: '', phoneNumber: '' });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const navigate = useNavigate();

  const handleSignInChange = (e) => {
    setSignInData({ ...signInData, [e.target.name]: e.target.value });
  };

  const handleSignUpChange = (e) => {
    setSignUpData({ ...signUpData, [e.target.name]: e.target.value });
  };

  const handleSignIn = async () => {
    try {
      const { email, password } = signInData;
      const response = await axios.post('http://localhost:3000/user/login', {
        email,
        password,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      // console.log(response)
      // localStorage.setItem('token', response.data.token); 
      // localStorage.setItem('userId',response.data.user._id)
      login(response.data.user,response.data.token)
      setSnackbarMessage('Logged in successfully!');
      setSnackbarOpen(true);

      // Add a slight delay before redirecting to ensure the Snackbar is visible
      setTimeout(() => {
        navigate('/'); // Redirect to home page after login
      }, 2000); // Adjust the timeout duration as needed

    } catch (error) {
      console.log(error); // Log the error for debugging

      if (error.response && error.response.data && error.response.data.error) {
        setSnackbarMessage(error.response.data.error); // Show the error message from the server
      } else {
        setSnackbarMessage('An unexpected error occurred. Please try again.'); // Fallback error message
      }
      setSnackbarOpen(true);
    }
  };

  const handleSignUp = async () => {
    try {
      const { name, email, password, phoneNumber } = signUpData;
      const response = await axios.post('http://localhost:3000/user/createUser', {
        name,
        email,
        password,
        phoneNumber,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Check for successful signup
      if (response.status === 201) {
        setSnackbarMessage('Account created successfully! You can now log in.');
        setSnackbarOpen(true);

        // Redirect to the Sign In tab after a slight delay
        setTimeout(() => {
          setActiveTab(0); // Switch to Sign In tab
        }, 2000); // Adjust the timeout duration as needed
      }
    } catch (error) {
      console.log(error); // Log the error for debugging

      if (error.response && error.response.data && error.response.data.error) {
        setSnackbarMessage(error.response.data.error); // Show the error message from the server
      } else {
        setSnackbarMessage('An unexpected error occurred. Please try again.'); // Fallback error message
      }
      setSnackbarOpen(true);
    }
  };

  return (
    <Container maxWidth="sm" style={{ marginTop: '2rem' }}>
      <Tabs
        value={activeTab}
        onChange={(event, newValue) => setActiveTab(newValue)}
        indicatorColor="primary"
        textColor="primary"
        centered
      >
        <Tab label="Sign In" />
        <Tab label="Sign Up" />
      </Tabs>

      {/* Sign In Form */}
      {activeTab === 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="h5">Sign In</Typography>
          <TextField
            fullWidth
            margin="normal"
            label="Email"
            name="email"
            value={signInData.email}
            onChange={handleSignInChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Password"
            type="password"
            name="password"
            value={signInData.password}
            onChange={handleSignInChange}
          />
          <Button variant="contained" color="primary" onClick={handleSignIn}>
            Sign In
          </Button>
        </Box>
      )}

      {/* Sign Up Form */}
      {activeTab === 1 && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="h5">Sign Up</Typography>
          <TextField
            fullWidth
            margin="normal"
            label="Name"
            name="name"
            value={signUpData.name}
            onChange={handleSignUpChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Email"
            name="email"
            value={signUpData.email}
            onChange={handleSignUpChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Password"
            type="password"
            name="password"
            value={signUpData.password}
            onChange={handleSignUpChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Phone Number"
            name="phoneNumber"
            value={signUpData.phoneNumber}
            onChange={handleSignUpChange}
          />
          <Button variant="contained" color="primary" onClick={handleSignUp}>
            Sign Up
          </Button>
        </Box>
      )}

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </Container>
  );
};

export default LoginPage;
