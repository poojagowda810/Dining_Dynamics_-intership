// HappinessCard.js
import React from 'react';
import { Box, Typography, Button } from '@mui/material';

const HappinessCard = ({ title, price, imgSrc }) => {
  return (
    <Box
      sx={{
        borderRadius: '15px',
        overflow: 'hidden',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        textAlign: 'center',
        backgroundColor: 'white',
      }}
    >
      <img src={imgSrc} alt={title} style={{ width: '100%', height: '150px', objectFit: 'cover' }} />
      <Box sx={{ p: 2 }}>
        <Typography variant="h6">{title}</Typography>
        <Typography variant="h4" sx={{ color: 'primary.main', my: 1 }}>
          ₹{price}
        </Typography>
        <Button variant="contained" color="primary">
          BUY NOW
        </Button>
      </Box>
    </Box>
  );
};

export default HappinessCard;
