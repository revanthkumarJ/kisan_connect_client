import React from 'react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import { useAuth } from '../pages/AuthContext';

const StyledCard = styled(Card)(({ theme, mode }) => ({
  maxWidth: '60%',
  margin: '16px auto', // Adds spacing between cards
  padding: 16,
  boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
  borderRadius: 8,
  transition: 'transform 0.2s ease-in-out',
  backgroundColor: mode === 'light' ? theme.palette.common.white : theme.palette.grey[900], // White for light mode
  color: mode === 'light' ? theme.palette.text.primary : theme.palette.text.secondary,
  '&:hover': {
    transform: 'scale(1.05)',
  },
}));

const StyledButton = styled(Button)(({ theme, mode, variant }) => ({
  backgroundColor: mode === 'light' ? theme.palette[variant].main : theme.palette[variant].dark,
  color: mode === 'light' ? 'white' : theme.palette.text.primary,
}));

const StyledTypography = styled(Typography)(({ mode }) => ({
  color: mode === 'light' ? '#1A237E' : '#BBDEFB', // Blue for light mode, light blue for dark mode
  fontWeight: 'bold',
}));

const GetAllCarousels = ({ carousel, onDelete, onEdit }) => {
  const { mode } = useAuth();

  return (
    <StyledCard mode={mode}>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box width="70%" pr={2}>
          <StyledTypography mode={mode} variant="h6" gutterBottom>
            Title: {carousel.title}
          </StyledTypography>

          <Stack direction="row" spacing={2} mt={2} justifyContent="center">
            <StyledButton
              mode={mode}
              variant="primary"
              onClick={() => onEdit(carousel._id || carousel.id)}
            >
              Edit
            </StyledButton>
            <StyledButton
              mode={mode}
              variant="error"
              onClick={() => onDelete(carousel._id || carousel.id)}
            >
              Delete
            </StyledButton>
          </Stack>
        </Box>

        <Box width="30%">
          <CardMedia
            component="img"
            image={carousel.previewUrl || `data:image/jpeg;base64,${carousel.image}`}
            alt="Carousel"
            sx={{
              width: '100%',
              height: 'auto',
              borderRadius: 2,
              border: mode === 'light' ? '1px solid rgba(0, 0, 0, 0.12)' : '1px solid rgba(255, 255, 255, 0.12)',
              objectFit: 'cover',
            }}
          />
        </Box>
      </Box>
    </StyledCard>
  );
};

export default GetAllCarousels;
