import React, { useContext, useState } from 'react';
import {
  Box,
  Button,
  Modal,
  Typography,
  TextField,
  IconButton,
  Backdrop,
  Link,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import config from "../../../config/Hosts";
import { AuthContext } from '../../GlobalContext';

const AuthModal = ({ }) => {
  const { authModal, handleAuthModalClose, setLoggedCount } = useContext(AuthContext)
  const host = config.host;
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
  const [formerror, setFormerror] = useState("");
  const handleToggle = () => {
    setIsLogin(!isLogin);
    setErrors({});
    setFormerror("")
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (isLogin) {
      setLoginData((prevState) => ({ ...prevState, [name]: value }));
    } else {
      setRegisterData((prevState) => ({ ...prevState, [name]: value }));
    }

    setErrors((prevState) => ({ ...prevState, [name]: '' }));
    setFormerror("")

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
        // Handle login
        console.log(loginData, 'loginData');
        axios.post(`${host}/api/user/user-login`, loginData)
          .then((response) => {
            if (response.data.success) {
              localStorage.setItem("userToken", JSON.stringify(response.data.token));
              toast.success('Login Successfully');
              setLoggedCount((prev) => prev + 1)
              handleAuthModalClose()
            } else {
              // setOpen2(true);
              setFormerror(response.data.message);
            }
          })
          .catch((err) => {
            console.log("Error : " + err);
          });
      } else {
        // Handle registration
        axios.post(`${host}/api/user/user-register`, registerData)
          .then((response) => {
            if (response.data.success) {
              toast.success(response.data.message);
              setLoginData({ email: '', password: '' })
              handleToggle()
            } else {
              toast.error(response.data.message);
              console.log("Some error occurred");
            }
          })
          .catch((err) => {
            console.log("Error:", err);
          });
      }
      // handleAuthModalClose();
    } else {
      console.log('Form has errors');
    }
  };

  return (
    <>
      <Modal
        open={authModal}
        handleAuthModalClose={handleAuthModalClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 1000,
        }}
        sx={{ zIndex: 9999 }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: 300, sm: 400 },
            bgcolor: 'background.paper',
            borderRadius: '30px',
            boxShadow: 1,
            p: 6,
          }}
        >
          <IconButton
            sx={{ position: 'absolute', top: 10, right: 10 }}
            onClick={handleAuthModalClose}
          >
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" gutterBottom color={"red"} fontSize={15}>
            {formerror}
          </Typography>
          <form onSubmit={handleSubmit}>
            {isLogin ? (
              <>
                <Typography variant="h6" gutterBottom>
                  Login
                </Typography>

                <TextField
                  placeholder="Email"
                  type="email"
                  name="email"
                  value={loginData.email}
                  onChange={handleInputChange}
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  sx={{
                    height: 40, // Reduced height
                    '& .MuiInputBase-root': {
                      height: '100%', // Ensure input height is consistent
                    },
                  }}
                  error={!!errors.email}
                  helperText={errors.email}
                />
                <TextField
                  placeholder="Password"
                  type="password"
                  name="password"
                  value={loginData.password}
                  onChange={handleInputChange}
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  sx={{
                    height: 40, // Reduced height
                    '& .MuiInputBase-root': {
                      height: '100%', // Ensure input height is consistent
                    },
                  }}
                  error={!!errors.password}
                  helperText={errors.password}
                />
                <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                  Login
                </Button>
                <Typography variant="body2" sx={{ mt: 2 }}>
                  Don't have an account?{' '}
                  <Link
                    component="button"
                    onClick={handleToggle}
                    sx={{
                      color: 'grey',
                      textDecoration: 'none',
                      '&:hover': {
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    Register
                  </Link>
                </Typography>
              </>
            ) : (
              <>
                <Typography variant="h6" gutterBottom>
                  Register
                </Typography>
                <TextField
                  placeholder="Name"
                  type="text"
                  name="name"
                  value={registerData.name}
                  onChange={handleInputChange}
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  sx={{
                    height: 40, // Reduced height
                    '& .MuiInputBase-root': {
                      height: '100%', // Ensure input height is consistent
                    },
                  }}
                  error={!!errors.name}
                  helperText={errors.name}
                />
                <TextField
                  placeholder="Email"
                  type="email"
                  name="email"
                  value={registerData.email}
                  onChange={handleInputChange}
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  sx={{
                    height: 40, // Reduced height
                    '& .MuiInputBase-root': {
                      height: '100%', // Ensure input height is consistent
                    },
                  }}
                  error={!!errors.email}
                  helperText={errors.email}
                />
                <TextField
                  placeholder="Password"
                  type="password"
                  name="password"
                  value={registerData.password}
                  onChange={handleInputChange}
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  sx={{
                    height: 40, // Reduced height
                    '& .MuiInputBase-root': {
                      height: '100%', // Ensure input height is consistent
                    },
                  }}
                  error={!!errors.password}
                  helperText={errors.password}
                />
                <TextField
                  placeholder="Address"
                  type="text"
                  name="address"
                  value={registerData.address}
                  onChange={handleInputChange}
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  sx={{
                    height: 40, // Reduced height
                    '& .MuiInputBase-root': {
                      height: '100%', // Ensure input height is consistent
                    },
                  }}
                  error={!!errors.address}
                  helperText={errors.address}
                />
                <TextField
                  placeholder="Phone Number"
                  type="text"
                  name="phone"
                  value={registerData.phone}
                  onChange={handleInputChange}
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  sx={{
                    height: 40, // Reduced height
                    '& .MuiInputBase-root': {
                      height: '100%', // Ensure input height is consistent
                    },
                  }}
                  error={!!errors.phone}
                  helperText={errors.phone}
                />
                <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                  Register
                </Button>
                <Typography variant="body2" sx={{ mt: 2 }}>
                  Already have an account?{' '}
                  <Link
                    component="button"
                    onClick={handleToggle}
                    sx={{
                      color: 'grey',
                      textDecoration: 'none',
                      '&:hover': {
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    Login
                  </Link>
                </Typography>
              </>
            )}
          </form>
        </Box>

      </Modal >

      <Toaster position="top-center" reverseOrder={false} />

    </>

  );
};

export default AuthModal;
