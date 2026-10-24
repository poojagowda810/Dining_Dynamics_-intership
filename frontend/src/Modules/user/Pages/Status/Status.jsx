import React, { useContext } from 'react';
import { Box, Typography, Container, Paper, Button } from '@mui/material';
import Order from './Order/Order';
import { AuthContext } from '../../../GlobalContext';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';

export default function Status() {
  const { token } = useContext(AuthContext);

  // Guests can view the static parts of the page, but Order component should handle token internally

  return (
    <Container maxWidth="lg" sx={{ mt: 15, mb: 10 }}>
      {/* Header Section */}
      <Paper 
        elevation={0} 
        sx={{ 
          padding: 4, 
          mb: 6, 
          borderRadius: '30px', 
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(0, 0, 0, 0.05)',
          textAlign: 'center'
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 2 }}>
          <ReceiptLongIcon sx={{ fontSize: 40, color: '#6366f1', mr: 2 }} />
          <Typography variant="h3" sx={{ fontWeight: 800, color: '#1f2937' }}>
            Your Order History
          </Typography>
        </Box>
        <Typography variant="body1" sx={{ color: '#4b5563', maxWidth: '700px', margin: '0 auto' }}>
          Track all your delicious meals in one place. Whether you paid online or chose cash on delivery, 
          you can find every detail of your dining experience right here.
        </Typography>
      </Paper>

      {/* Orders Section */}
        {token === false ? (
          <Box 
            sx={{ 
                p: 8, 
                textAlign: 'center', 
                bgcolor: 'rgba(255, 255, 255, 0.5)', 
                backdropFilter: 'blur(10px)',
                borderRadius: '30px',
                border: '1px dashed #6366f1'
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: 800, mb: 2, color: '#1f2937' }}>
              Want to track your tasty meals?
            </Typography>
            <Typography variant="body1" sx={{ color: '#6366f1', mb: 4, fontWeight: 700 }}>
              Log in to your account and see where your food is!
            </Typography>
            <Button 
                variant="contained" 
                size="large"
                href="/login"
                sx={{ 
                  borderRadius: '16px', 
                  bgcolor: '#6366f1', 
                  px: 6, 
                  py: 1.5,
                  fontWeight: 800,
                  textTransform: 'none'
                }}
            >
              Take Me to Login
            </Button>
          </Box>
        ) : (
          <Order />
        )}
    </Container>
  );
}
