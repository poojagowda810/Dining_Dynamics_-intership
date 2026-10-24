import React from 'react';
import { Box, Container, Typography, Grid } from '@mui/material';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <Box
      sx={{
        width: '100%',
        backgroundColor:'#1f1f1f',
        color: 'white',
        py: 4,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={5}>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>
              Dining Dynamics
            </Typography>
            <Typography variant="body2">
              Your ultimate dining experience. Come and taste the best dishes crafted with passion and care.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>
              Quick Links
            </Typography>
            <Link to="/" style={{ color: 'inherit', textDecoration: 'none', display: 'block' }}>
              Home
            </Link>
            <Link to="/menus" style={{ color: 'inherit', textDecoration: 'none', display: 'block' }}>
              Menu
            </Link>
            <Link to="/aboutus" style={{ color: 'inherit', textDecoration: 'none', display: 'block' }}>
              About Us
            </Link>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>
              Contact Us
            </Typography>
            <Typography variant="body2">
              1234 Culinary St.<br />
              Food City, FC 56789<br />
              Email: info@diningdynamics.com<br />
              Phone: (123) 456-7890
            </Typography>
          </Grid>
        </Grid>
        <Box
          mt={4}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          flexWrap="wrap"
        >
          <Typography variant="body2">
            © {new Date().getFullYear()} Dining Dynamics. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
