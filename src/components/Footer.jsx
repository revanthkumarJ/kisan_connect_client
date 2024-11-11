import React from 'react';
import { Box, Typography, Link, IconButton } from '@mui/material';
import { Instagram, Facebook, YouTube, Twitter, LinkedIn } from '@mui/icons-material';

const Footer = () => {
  return (
    <Box sx={{ bgcolor: '#795548', color: 'white', p: 3, textAlign: 'center' }}>
      {/* Logo Section - Uncomment if a logo is available */}
      {/* <Box sx={{ mb: 2 }}>
        <img src="logo.png" alt="Kisan Connect Logo" style={{ height: '50px' }} />
      </Box> */}

      {/* Social Media Links */}
      <Box sx={{ mb: 2 }}>
        <IconButton href="https://www.instagram.com" target="_blank" sx={{ color: 'white' }}>
          <Instagram />
        </IconButton>
        <IconButton href="https://www.facebook.com" target="_blank" sx={{ color: 'white' }}>
          <Facebook />
        </IconButton>
        <IconButton href="https://www.youtube.com" target="_blank" sx={{ color: 'white' }}>
          <YouTube />
        </IconButton>
        
        <IconButton href="https://www.twitter.com" target="_blank" sx={{ color: 'white' }}>
          <Twitter />
        </IconButton>
        <IconButton href="https://www.linkedin.com" target="_blank" sx={{ color: 'white' }}>
          <LinkedIn />
        </IconButton>
      </Box>

      {/* Contact Information */}
      <Typography variant="body2">
        Contact: <Link href="tel:+9030808053" color="inherit" underline="hover">9030808053</Link> | 
        <Link href="mailto:kisanConnect@gmail.com" color="inherit" underline="hover"> kisanConnect@gmail.com</Link>
      </Typography>

      {/* Copyright */}
      <Typography variant="body2" sx={{ mt: 2 }}>
        © 2024 Kisan Connect
      </Typography>
    </Box>
  );
};

export default Footer;
