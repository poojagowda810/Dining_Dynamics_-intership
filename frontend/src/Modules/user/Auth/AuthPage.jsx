import React, { useContext, useState } from 'react';
import {
  Box,
  Button,
  Typography,
  TextField,
  Link,
  Container,
  Paper,
  InputAdornment,
} from '@mui/material';
import { Email, Lock, Person, Home, Phone } from '@mui/icons-material';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import config from "../../../config/Hosts";
import { AuthContext } from '../../GlobalContext';
import { useNavigate } from 'react-router-dom';

const AuthPage = () => {
  const { setToken, setLoggedCount } = useContext(AuthContext);
  const host = config.host;
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    address: '',
    phone: '',
  });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");

  const handleToggle = () => {
    setIsLogin(!isLogin);
    setErrors({});
    setFormError("");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (isLogin) {
      setLoginData((prev) => ({ ...prev, [name]: value }));
    } else {
      setRegisterData((prev) => ({ ...prev, [name]: value }));
    }
    setErrors((prev) => ({ ...prev, [name]: '' }));
    setFormError("");
  };

  const validate = () => {
    let tempErrors = {};
    if (isLogin) {
      if (!loginData.email) tempErrors.email = 'Email is required';
      if (!loginData.password) tempErrors.password = 'Password is required';
    } else {
      if (!registerData.name) tempErrors.name = 'Name is required';
      if (!registerData.email) tempErrors.email = 'Email is required';
      if (!registerData.password) tempErrors.password = 'Password is required';
      if (!registerData.address) tempErrors.address = 'Address is required';
      if (!registerData.phone) tempErrors.phone = 'Phone number is required';
      else if (!/^\d{10}$/.test(registerData.phone)) tempErrors.phone = 'Phone number must be 10 digits';
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      if (isLogin) {
        axios.post(`${host}/api/user/user-login`, loginData)
          .then((response) => {
            if (response.data.success) {
              localStorage.setItem("userToken", JSON.stringify(response.data.token));
              setToken(true);
              toast.success('Login Successfully');
              setLoggedCount((prev) => prev + 1);
              navigate('/');
            } else {
              setFormError(response.data.message);
            }
          })
          .catch((err) => {
            setFormError("Login failed. Please try again.");
            console.error("Login Error:", err);
          });
      } else {
        axios.post(`${host}/api/user/user-register`, registerData)
          .then((response) => {
            if (response.data.success) {
              toast.success(response.data.message);
              setLoginData({ email: registerData.email, password: '' });
              setIsLogin(true); // Switch to login after registration
            } else {
              toast.error(response.data.message);
            }
          })
          .catch((err) => {
            toast.error("Registration failed.");
            console.error("Registration Error:", err);
          });
      }
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          width: '300px',
          height: '300px',
          background: 'rgba(255, 255, 255, 0.15)',
          borderRadius: '50%',
          top: '-100px',
          left: '-100px',
          filter: 'blur(60px)',
          animation: 'float 20s infinite alternate',
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          width: '400px',
          height: '400px',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '50%',
          bottom: '-150px',
          right: '-150px',
          filter: 'blur(80px)',
          animation: 'float 25s infinite alternate-reverse',
        },
        '@keyframes float': {
          '0%': { transform: 'translate(0, 0)' },
          '100%': { transform: 'translate(50px, 50px)' },
        }
      }}
    >
      <Toaster position="top-center" reverseOrder={false} />
      
      <Container maxWidth="sm" sx={{ zIndex: 1 }}>
        <Paper
          elevation={0}
          sx={{
            padding: { xs: 4, md: 6 },
            borderRadius: '40px',
            background: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            textAlign: 'center',
          }}
        >
          <Box mb={4}>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#1f2937', mb: 1 }}>
              {isLogin ? 'Welcome Back!' : 'Create Account'}
            </Typography>
            <Typography variant="body1" sx={{ color: '#4b5563' }}>
              {isLogin ? 'Login to continue your dining experience' : 'Join us for exclusive dining rewards'}
            </Typography>
          </Box>

          {formError && (
            <Typography variant="body2" color="error" sx={{ mb: 2, fontWeight: 500 }}>
              {formError}
            </Typography>
          )}

          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <TextField
                fullWidth
                placeholder="Full Name"
                name="name"
                value={registerData.name}
                onChange={handleInputChange}
                error={!!errors.name}
                helperText={errors.name}
                sx={{ mb: 2 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person sx={{ color: '#6366f1' }} />
                    </InputAdornment>
                  ),
                  sx: { borderRadius: '15px' }
                }}
              />
            )}

            <TextField
              fullWidth
              placeholder="Email Address"
              name="email"
              type="email"
              value={isLogin ? loginData.email : registerData.email}
              onChange={handleInputChange}
              error={!!errors.email}
              helperText={errors.email}
              sx={{ mb: 2 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email sx={{ color: '#6366f1' }} />
                  </InputAdornment>
                ),
                sx: { borderRadius: '15px' }
              }}
            />

            {!isLogin && (
              <>
                <TextField
                  fullWidth
                  placeholder="Phone Number"
                  name="phone"
                  value={registerData.phone}
                  onChange={handleInputChange}
                  error={!!errors.phone}
                  helperText={errors.phone}
                  sx={{ mb: 2 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Phone sx={{ color: '#6366f1' }} />
                      </InputAdornment>
                    ),
                    sx: { borderRadius: '15px' }
                  }}
                />
                <TextField
                  fullWidth
                  placeholder="Address"
                  name="address"
                  value={registerData.address}
                  onChange={handleInputChange}
                  error={!!errors.address}
                  helperText={errors.address}
                  sx={{ mb: 2 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Home sx={{ color: '#6366f1' }} />
                      </InputAdornment>
                    ),
                    sx: { borderRadius: '15px' }
                  }}
                />
              </>
            )}

            <TextField
              fullWidth
              placeholder="Password"
              name="password"
              type="password"
              value={isLogin ? loginData.password : registerData.password}
              onChange={handleInputChange}
              error={!!errors.password}
              helperText={errors.password}
              sx={{ mb: 3 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock sx={{ color: '#6366f1' }} />
                  </InputAdornment>
                ),
                sx: { borderRadius: '15px' }
              }}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                py: 1.5,
                borderRadius: '15px',
                fontSize: '1.1rem',
                fontWeight: 600,
                textTransform: 'none',
                background: 'linear-gradient(90deg, #6366f1, #a855f7)',
                '&:hover': {
                  background: 'linear-gradient(90deg, #4f46e5, #9333ea)',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                }
              }}
            >
              {isLogin ? 'Sign In' : 'Create Account'}
            </Button>
          </form>

          <Box mt={4}>
            <Typography variant="body2" sx={{ color: '#6b7280' }}>
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <Link
                component="button"
                onClick={handleToggle}
                sx={{
                  color: '#6366f1',
                  fontWeight: 700,
                  textDecoration: 'none',
                  '&:hover': { textDecoration: 'underline' }
                }}
              >
                {isLogin ? 'Register' : 'Login'}
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default AuthPage;
