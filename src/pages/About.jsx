import React from 'react';
import { Box, Typography, Card, CardContent, Grid, IconButton, Avatar, Button } from '@mui/material';
import { GitHub, LinkedIn, Facebook, Instagram } from '@mui/icons-material';
import GitHubIcon from '@mui/icons-material/GitHub';
import { useAuth } from './AuthContext';

// Importing images
import RevanthImage from '../assets/revanth.jpeg';
import SreekanthImage from '../assets/sreekanth.jpg';
import RameshImage from '../assets/ramesh.jpg';

const developers = [
  {
    name: 'J.Revanth Kumar',
    role: 'Team Lead',
    expertise: 'Full Stack Developer',
    image: RevanthImage,
    socials: {
      instagram: 'https://www.instagram.com/revanth_kumar_j',
      linkedin: 'https://www.linkedin.com/in/jilakararevanthkumar/',
      facebook: 'https://www.facebook.com/jilakara.revanthkumar',
      github: 'https://github.com/revanthkumarJ',
    },
  },
  {
    name: 'T.Sreekanth',
    role: 'Member',
    expertise: 'Frontend Developer',
    image: SreekanthImage,
    socials: {
      instagram: 'https://instagram.com/sreekanth',
      linkedin: 'https://linkedin.com/in/sreekanth',
      facebook: 'https://facebook.com/sreekanth',
      github: 'https://github.com/sreekanth',
    },
  },
  {
    name: 'B.Ramesh',
    role: 'Member',
    expertise: 'Frontend Developer',
    image: RameshImage,
    socials: {
      instagram: 'https://instagram.com/ramesh',
      linkedin: 'https://linkedin.com/in/ramesh',
      facebook: 'https://facebook.com/ramesh',
      github: 'https://github.com/ramesh',
    },
  },
];

const technologies = {
  frontend: ['React', 'Material UI'],
  backend: ['Express.js', 'TypeScript'],
  database: ['MongoDB'],
  repos: {
    frontend: 'https://github.com/revanthkumarJ/kisan_connect_client',
    backend: 'https://github.com/revanthkumarJ/Kisan_connect_API',
  },
};

const AboutUsPage = () => {
  const { mode } = useAuth();
  const isDarkMode = mode === 'dark';

  return (
    <Box
      sx={{
        padding: '2rem',
        maxWidth: '100vw',
        backgroundColor: isDarkMode ? '#121212' : '#f4f6f9',
        color: isDarkMode ? '#90caf9' : 'inherit',
      }}
    >
      {/* Project Description */}
      <Box mb={6}>
        <Typography
          variant="h4"
          fontWeight="bold"
          gutterBottom
          align="center"
          sx={{ fontSize: '2rem' }}
        >
          About Kisan Connect
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          align="center"
          sx={{
            fontSize: '1.1rem',
            lineHeight: 1.7,
            maxWidth: '800px',
            mx: 'auto',
            color: isDarkMode ? '#90caf9' : 'text.secondary',
          }}
        >
          Kisan Connect is a platform dedicated to improving the agricultural marketplace by enabling direct interactions between farmers and consumers.
          Farmers can offer their products directly to end consumers, ensuring fair prices and minimizing intermediaries. Our team has built a user-friendly
          interface along with a robust backend to support various functions including order management, product cataloging, and real-time updates on stock.
          We are committed to empowering the agricultural community through technology.
        </Typography>
      </Box>

      {/* Developer Profiles */}
      <Box mb={6}>
        <Typography
          variant="h5"
          fontWeight="bold"
          gutterBottom
          align="center"
          sx={{ fontSize: '1.8rem' }}
        >
          Meet Our Developers
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          {developers.map((dev, index) => (
            <Grid item key={index} xs={12} sm={6} md={4}>
              <Card
                sx={{
                  maxWidth: 400,
                  padding: '1.5rem',
                  textAlign: 'center',
                  backgroundColor: isDarkMode ? '#1e1e1e' : '#fff',
                  color: isDarkMode ? '#90caf9' : 'inherit',
                  boxShadow: isDarkMode ? '0px 4px 10px rgba(0, 0, 0, 0.5)' : '0px 4px 10px rgba(0, 0, 0, 0.1)',
                }}
              >
                <Avatar
                  sx={{ width: 120, height: 120, margin: '0 auto 1rem' }}
                  alt={dev.name}
                  src={dev.image}
                />
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" sx={{ fontSize: '1.3rem' }}>
                    {dev.name}
                  </Typography>
                  <Typography variant="subtitle1"  sx={{ fontSize: '1.1rem',color: isDarkMode ? '#90caf9' : 'text.secondary' }}>
                    {dev.role}
                  </Typography>
                  <Typography variant="body2" sx={{ marginBottom: '1rem', fontSize: '1rem', color: isDarkMode ? '#90caf9' : 'text.secondary' }}>
                    {dev.expertise}
                  </Typography>
                  <Box>
                    <IconButton component="a" href={dev.socials.instagram} target="_blank" sx={{ color: '#E4405F', '&:hover': { color: '#C13584' } }}>
                      <Instagram />
                    </IconButton>
                    <IconButton component="a" href={dev.socials.linkedin} target="_blank" sx={{ color: '#0077B5', '&:hover': { color: '#005582' } }}>
                      <LinkedIn />
                    </IconButton>
                    <IconButton component="a" href={dev.socials.facebook} target="_blank" sx={{ color: '#4267B2', '&:hover': { color: '#365899' } }}>
                      <Facebook />
                    </IconButton>
                    <IconButton component="a" href={dev.socials.github} target="_blank" sx={{ color: '#333', '&:hover': { color: '#24292F' } }}>
                      <GitHub />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Technologies Used */}
      <Box mb={6} sx={{ textAlign: 'center' }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ fontSize: '1.8rem' }}>
          Technologies Used
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" fontWeight="bold" sx={{ fontSize: '1.2rem' }}>
              Frontend
            </Typography>
            <Typography variant="body1" sx={{ fontSize: '1.1rem', color: isDarkMode ? '#90caf9' : 'text.primary' }}>
              {technologies.frontend.join(', ')}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" fontWeight="bold" sx={{ fontSize: '1.2rem' }}>
              Backend
            </Typography>
            <Typography variant="body1" sx={{ fontSize: '1.1rem', color: isDarkMode ? '#90caf9' : 'text.primary' }}>
              {technologies.backend.join(', ')}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" fontWeight="bold" sx={{ fontSize: '1.2rem' }}>
              Database
            </Typography>
            <Typography variant="body1" sx={{ fontSize: '1.1rem', color: isDarkMode ? '#90caf9' : 'text.primary' }}>
              {technologies.database.join(', ')}
            </Typography>
          </Grid>
        </Grid>
      </Box>

      {/* GitHub Repository Links */}
      <Box textAlign="center" mb={4}>
        <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ fontSize: '1.8rem' }}>
          Project Repositories
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<GitHubIcon />}
          href={technologies.repos.frontend}
          target="_blank"
          sx={{
            margin: '0.5rem',
            fontSize: '1rem',
            padding: '0.8rem 2rem',
            backgroundColor: isDarkMode ? '#333' : 'primary.main',
          }}
        >
          Frontend Repository
        </Button>
        <Button
          variant="contained"
          color="primary"
          startIcon={<GitHubIcon />}
          href={technologies.repos.backend}
          target="_blank"
          sx={{
            margin: '0.5rem',
            fontSize: '1rem',
            padding: '0.8rem 2rem',
            backgroundColor: isDarkMode ? '#333' : 'primary.main',
          }}
        >
          Backend Repository
        </Button>
      </Box>
    </Box>
  );
};

export default AboutUsPage;
