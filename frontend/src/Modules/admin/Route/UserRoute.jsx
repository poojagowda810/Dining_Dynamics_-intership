import React, { useState, useEffect, useContext } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Box, CssBaseline } from '@mui/material';
import Home from '../../user/Pages/Home/Home';
import Menus from '../../user/Pages/Menus/Menus';
import Footer from '../../user/Footer/Footer';
import Nav from '../../user/Navbar/Nav';
import Loader from '../../components/Loader.jsx';
import Status from '../../user/Pages/Status/Status.jsx';
import AboutUs from '../../user/Pages/AboutUs/AboutUs.jsx';
import AuthPage from '../../user/Auth/AuthPage';
import TrackOrder from '../../user/Pages/Status/TrackOrder.jsx';
import { AuthContext } from '../../GlobalContext';


export default function UserRoute() {
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const currentRoute = location.pathname;
  const { token } = useContext(AuthContext);

  useEffect(() => {
    // Show loader during route transition
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, [location]);



  // token === null means we are still verifying the session
  if (token === null) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'white' }}>
        <Loader />
      </Box>
    );
  }

  // token === false means no session exists - redirect to login unless already on /login
  if (token === false && currentRoute !== '/login') {
    return <Navigate to="/login" />;
  }

  // Redirect to home if they are already logged in and try to visit /login
  if (token === true && currentRoute === '/login') {
    return <Navigate to="/" />;
  }

  const shouldDisplayFooter = currentRoute !== '/login';
  const shouldDisplayNav = currentRoute !== '/login';

  return (
    <div>
      <CssBaseline />
      <Box sx={{ backgroundColor: 'white' }}>
        {shouldDisplayNav && <Nav />}
        {loading ? (
          <Loader />
        ) : (
          <>
            <Routes>
              <Route exact path="/login" element={<AuthPage />} />
              <Route exact path="/" element={<Home />} />
              <Route exact path="/menus" element={<Menus />} />
              <Route exact path="/orders" element={<Status />} />
              <Route exact path="/aboutus" element={<AboutUs />} />
              <Route path="/track-order/:id" element={<TrackOrder />} />
              {/* Fallback to Home for any unknown route */}
              <Route path="*" element={<Navigate to="/" />} />

            </Routes>
            {shouldDisplayFooter && <Footer />}
          </>
        )}
      </Box>
    </div>
  );
}
