import React, { useState } from 'react';
import {
    TextField,
    Button,
    Typography,
    Container,
    Box,
    Paper,
    Avatar,
    InputAdornment,
    CssBaseline,
} from '@mui/material';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import axios from 'axios';
import config from '../../config/Hosts';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const nav = useNavigate();
    const host = config.host;

    // Redirect if already logged in
    React.useEffect(() => {
        const adminToken = sessionStorage.getItem('adminToken');
        if (adminToken && adminToken !== "null" && adminToken !== "undefined") {
            nav("/admin/");
        }
    }, [nav]);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [formErrors, setFormErrors] = useState({
        email: '',
        password: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setFormErrors({ ...formErrors, [name]: '' });
    };

    const validateForm = () => {
        let valid = true;
        const errors = { email: '', password: '' };

        if (!formData.email) {
            errors.email = 'Admin email is required';
            valid = false;
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = 'Email format is invalid';
            valid = false;
        }
        if (!formData.password) {
            errors.password = 'Password is required';
            valid = false;
        }
        setFormErrors(errors);
        return valid;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            axios.post(`${host}/api/admin/login`, formData)
                .then((response) => {
                    if (response.data.success === true) {
                        sessionStorage.setItem("adminToken", JSON.stringify(response.data.token));
                        toast.success('Admin Login Successfully');
                        setTimeout(() => {
                            nav("/admin/");
                        }, 1000);
                    } else {
                        toast.error('Invalid Credentials');
                    }
                })
                .catch((err) => {
                    console.error("Login Error:", err);
                    const errorMessage = err.response?.data?.message || 'Connection Failed';
                    toast.error(errorMessage);
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
                background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  width: '500px',
                  height: '500px',
                  background: 'rgba(99, 102, 241, 0.05)',
                  borderRadius: '50%',
                  top: '-200px',
                  right: '-100px',
                  filter: 'blur(80px)',
                }
            }}
        >
            <CssBaseline />
            <Toaster position="top-center" reverseOrder={false} />
            
            <Container maxWidth="xs" sx={{ zIndex: 1 }}>
                <Paper
                    elevation={0}
                    sx={{
                        p: { xs: 4, sm: 6 },
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        borderRadius: '40px',
                        background: 'rgba(255, 255, 255, 0.03)',
                        backdropFilter: 'blur(30px)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                        color: 'white'
                    }}
                >
                    <Avatar 
                        sx={{ 
                            m: 1, 
                            bgcolor: '#6366f1', 
                            width: 60, 
                            height: 60,
                            boxShadow: '0 0 20px rgba(99, 102, 241, 0.4)'
                        }}
                    >
                        <AdminPanelSettingsIcon fontSize="large" />
                    </Avatar>
                    
                    <Typography component="h1" variant="h4" sx={{ mt: 2, fontWeight: 800, letterSpacing: '-0.025em' }}>
                        Admin Portal
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 4, opacity: 0.6 }}>
                        Secure access for DiningDynamics management
                    </Typography>

                    <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
                        <TextField
                            margin="normal"
                            fullWidth
                            placeholder="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            value={formData.email}
                            onChange={handleInputChange}
                            error={!!formErrors.email}
                            helperText={formErrors.email}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <EmailIcon sx={{ color: '#6366f1' }} />
                                    </InputAdornment>
                                ),
                                sx: { 
                                    borderRadius: '16px',
                                    bgcolor: 'rgba(255, 255, 255, 0.05)',
                                    color: 'white',
                                    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.1)' },
                                    '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                                    '&.Mui-focused fieldset': { borderColor: '#6366f1' }
                                }
                            }}
                            sx={{
                              '& .MuiInputBase-input::placeholder': { color: 'rgba(255,255,255,0.4)', opacity: 1 },
                              '& .MuiFormHelperText-root': { color: '#fb7185' }
                            }}
                        />
                        <TextField
                            margin="normal"
                            fullWidth
                            name="password"
                            placeholder="Password"
                            type="password"
                            autoComplete="current-password"
                            value={formData.password}
                            onChange={handleInputChange}
                            error={!!formErrors.password}
                            helperText={formErrors.password}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <LockIcon sx={{ color: '#6366f1' }} />
                                    </InputAdornment>
                                ),
                                sx: { 
                                    borderRadius: '16px',
                                    bgcolor: 'rgba(255, 255, 255, 0.05)',
                                    color: 'white',
                                    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.1)' },
                                    '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                                    '&.Mui-focused fieldset': { borderColor: '#6366f1' }
                                }
                            }}
                            sx={{
                              '& .MuiInputBase-input::placeholder': { color: 'rgba(255,255,255,0.4)', opacity: 1 },
                              '& .MuiFormHelperText-root': { color: '#fb7185' }
                            }}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ 
                                mt: 3, 
                                mb: 2, 
                                py: 1.5, 
                                borderRadius: '16px',
                                textTransform: 'none',
                                fontWeight: 700,
                                fontSize: '1rem',
                                bgcolor: '#6366f1',
                                '&:hover': { bgcolor: '#4f46e5', boxShadow: '0 0 20px rgba(99, 102, 241, 0.4)' }
                            }}
                        >
                            Log In
                        </Button>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};

export default Login;
