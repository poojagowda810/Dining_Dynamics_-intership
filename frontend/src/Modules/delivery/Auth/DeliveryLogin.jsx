import React, { useState, useContext } from 'react';
import { AuthContext } from '../../GlobalContext';
import {
  Box,
  Button,
  Typography,
  TextField,
  Container,
  Paper,
  InputAdornment,
  Avatar,
} from '@mui/material';
import { Email, Lock, DirectionsBikeRounded } from '@mui/icons-material';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import config from "../../../config/Hosts";
import { useNavigate } from 'react-router-dom';

const DeliveryLogin = () => {
  const host = config.host;
  const navigate = useNavigate();
  const { setAssignedCount } = useContext(AuthContext);

  // Redirect if already logged in
  React.useEffect(() => {
    const deliveryToken = sessionStorage.getItem('deliveryToken');
    if (deliveryToken && deliveryToken !== "null" && deliveryToken !== "undefined") {
      navigate('/delivery');
    }
  }, [navigate]);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    let tempErrors = {};
    if (!loginData.email) tempErrors.email = 'Email is required';
    if (!loginData.password) tempErrors.password = 'Password is required';
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      axios.post(`${host}/api/user/user-login`, loginData)
        .then((response) => {
          if (response.data.success) {
            if (response.data.role === 'delivery') {
              sessionStorage.setItem("deliveryToken", JSON.stringify(response.data.token));
              setAssignedCount(prev => prev + 1);
              toast.success('Courier Login Successfully');
              setTimeout(() => navigate('/delivery'), 1000);
            } else {
              toast.error('Access Denied: Not a Delivery Boy account');
            }
          } else {
            toast.error(response.data.message);
          }
        })
        .catch((err) => {
          toast.error("Login failed. Please try again.");
          console.error("Login Error:", err);
        });
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0f172a',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Toaster position="top-center" />
      
      <Container maxWidth="xs" sx={{ zIndex: 1 }}>
        <Paper
          elevation={0}
          sx={{
            padding: { xs: 4, md: 6 },
            borderRadius: '40px',
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            textAlign: 'center',
            color: 'white'
          }}
        >
          <Avatar 
            sx={{ 
              bgcolor: '#10b981', 
              width: 80, 
              height: 80, 
              margin: '0 auto 24px',
              boxShadow: '0 0 30px rgba(16, 185, 129, 0.3)'
            }}
          >
            <DirectionsBikeRounded sx={{ fontSize: 40 }} />
          </Avatar>

          <Box mb={4}>
            <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
              Courier Dock
            </Typography>
            <Typography variant="body1" sx={{ color: '#94a3b8' }}>
              Secure access for delivery staff
            </Typography>
          </Box>

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              placeholder="Courier Email"
              name="email"
              type="email"
              variant="outlined"
              value={loginData.email}
              onChange={handleInputChange}
              error={!!errors.email}
              helperText={errors.email}
              sx={{ mb: 2 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email sx={{ color: '#10b981' }} />
                  </InputAdornment>
                ),
                sx: { 
                  borderRadius: '16px', 
                  color: 'white',
                  bgcolor: 'rgba(255,255,255,0.05)',
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.1)' }
                }
              }}
            />

            <TextField
              fullWidth
              placeholder="Secret Password"
              name="password"
              type="password"
              variant="outlined"
              value={loginData.password}
              onChange={handleInputChange}
              error={!!errors.password}
              helperText={errors.password}
              sx={{ mb: 4 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock sx={{ color: '#10b981' }} />
                  </InputAdornment>
                ),
                sx: { 
                  borderRadius: '16px', 
                  color: 'white',
                  bgcolor: 'rgba(255,255,255,0.05)',
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.1)' }
                }
              }}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                py: 2,
                borderRadius: '16px',
                fontSize: '1.1rem',
                fontWeight: 700,
                textTransform: 'none',
                bgcolor: '#10b981',
                '&:hover': {
                  bgcolor: '#059669',
                  boxShadow: '0 10px 20px -3px rgba(16, 185, 129, 0.4)',
                }
              }}
            >
              Enter Dashboard
            </Button>
          </form>
        </Paper>
      </Container>
    </Box>
  );
};

export default DeliveryLogin;
