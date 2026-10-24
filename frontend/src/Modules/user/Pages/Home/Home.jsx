import React, { useContext, useState } from 'react';
import { Box, Typography, Button, TextField, Grid, Container } from '@mui/material';
import MainBanner from '../../Images/MainBanner.jpg';
import Footer from '../../Footer/Footer'; // Import the Footer component
import { AuthContext } from '../../../GlobalContext';
import { useNavigate } from 'react-router-dom';

const App = () => {
  let navigate = useNavigate();

  return (
    <>
      <Box sx={{ position: 'relative', height: 'calc(100vh - 64px)', overflow: 'hidden', mt: '64px' }}>
        {/* Background Image */}
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '100%',
            height: '100%',
            transform: 'translate(-50%, -50%)', // Center the image
            backgroundImage: `url(${MainBanner})`, // Use the imported image
            backgroundSize: 'cover',
            backgroundPosition: 'center', // Center the background image
            opacity: 1,
          }}
        />

        {/* Content */}
        <Box
          sx={{
            position: 'relative',
            zIndex: 2,
            display: 'flex',
            flexDirection: 'column', // Stack items vertically
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100%',
            p: '10px',
            // textAlign: 'center', // Center text within the container
          }}
        >
          <Grid container spacing={2} sx={{ justifyContent: 'center', alignItems: 'center' }}>
            <Grid item xs={12} md={6}>
              {/* Header Content */}
              <Typography variant="h2" gutterBottom sx={{ color: 'white', textAlign: 'left' }}>
                Let us serve you better
              </Typography>
              <Typography variant="h4" gutterBottom sx={{ color: 'white' }}>
                Don’t wait in a line to enjoy your meal. Reserve a table in advance with us.
              </Typography>
            </Grid>

          </Grid>
        </Box>
      </Box>


      <Box sx={{ width: '100%', my: 8, px: 2 }}>
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h2" sx={{ fontWeight: 'bold', mb: 2 }}>
          Welcome to Dining Dynamics
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          Here you can browse our menu, place orders, and enjoy a great dining experience.
          </Typography>
        </Box>
        </Box>

      {/* Feature Section */}
      <Box sx={{ my: 6, p: 4, backgroundColor: '#f7f7f7' }}>
        <Container>
          <Typography variant="h4" gutterBottom sx={{ textAlign: 'center' }}>
            Our Features
          </Typography>
          <Grid container spacing={4} sx={{ mt: 2 }}>
            <Grid item xs={12} md={4}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
                Order Food Online
              </Typography>
              <Typography variant="body1">
                Browse our extensive menu and place orders directly from your table or from the comfort of your home.
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
                Request a Table
              </Typography>
              <Typography variant="body1">
                Avoid the wait! Reserve your table in advance and arrive to a ready table, prepared just for you.
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
                Check Order Status
              </Typography>
              <Typography variant="body1">
                Keep track of your order status, and receive real-time updates on your meal preparation and delivery.
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>

    </>
  );
};

export default App;
