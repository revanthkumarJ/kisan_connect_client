import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import { Button, Card, CardContent, Typography, Snackbar, Alert, CircularProgress, Grid } from '@mui/material';

const FarmerApplicationPage = () => {
  const { mode } = useAuth();
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const containerStyle = {
    backgroundColor: mode === 'light' ? '#f5f5f5' : '#121212',
    color: mode === 'light' ? '#000' : '#fff',
    padding: '20px',
    minHeight: '100vh',
  };

  const cardStyle = {
    backgroundColor: mode === 'light' ? '#fff' : '#333',
    color: mode === 'light' ? '#000' : '#fff',
    marginBottom: '20px',
    padding: '10px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  };

  const buttonStyle = {
    backgroundColor: mode === 'light' ? '#1976d2' : '#90caf9',
    color: '#fff',
    marginTop: '10px',
  };

  const fetchApplicants = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/admin/farmer/getAllFarmerApplicants', {
        headers: {
          'auth-token': token,
        },
      });
      setApplicants(response.data);
    } catch (error) {
      console.error('Error fetching applicants:', error);
      setSnackbarMessage('Error fetching applicants.');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (applicantId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `http://localhost:3000/admin/farmer/approveFarmer/${applicantId}`, // Use dynamic ID in the URL
        {},
        {
          headers: {
            'auth-token': token, // Send the auth-token in headers
          },
        }
      );
      console.log(response)
      if (response.status==200) {
        setApplicants(applicants.filter(applicant => applicant._id !== applicantId));
        setSnackbarMessage('Applicant approved successfully!');
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error('Error approving applicant:', error);
      setSnackbarMessage('Error approving applicant.');
      setSnackbarOpen(true);
    }
  };
  

  useEffect(() => {
    fetchApplicants();
  }, []);

  return (
    <div style={containerStyle}>
      <Typography variant="h4" component="h1" style={{ textAlign: 'center', marginBottom: '20px' }}>
        Farmer Applicants
      </Typography>

      {loading ? (
        <CircularProgress style={{ display: 'block', margin: 'auto' }} />
      ) : (
        <Grid container spacing={3}>
          {applicants.map((applicant) => (
            <Grid item xs={12} sm={6} md={4} key={applicant._id}>
              <Card style={cardStyle}>
                <CardContent>
                    
                  <Typography variant="h6">{applicant.userId}</Typography>
                  <Typography variant="body1">Farm Location: {applicant.farmLocation}</Typography>
                  <Typography variant="body1">Farm Size: {applicant.farmSize}</Typography>
                  <Typography variant="body1">Experience: {applicant.experience}</Typography>

                  <img
                    src={`data:image/jpeg;base64,${applicant.farmPhoto}`} // Base64 image
                    alt="Farm"
                    style={{ width: '100%', height: '200px', objectFit: 'cover', marginTop: '10px' }}
                  />
                  <img
                    src={`data:image/jpeg;base64,${applicant.photoOfProofThatHeIsFarmer}`} // Base64 image
                    alt="Proof"
                    style={{ width: '100%', height: '200px', objectFit: 'cover', marginTop: '10px' }}
                  />

                  <Button style={buttonStyle} onClick={() => handleApprove(applicant._id)}>
                    Approve
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={() => setSnackbarOpen(false)}>
        <Alert onClose={() => setSnackbarOpen(false)} severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default FarmerApplicationPage;
