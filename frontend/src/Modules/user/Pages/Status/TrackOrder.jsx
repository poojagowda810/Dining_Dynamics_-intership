import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Typography, Avatar, Paper, Stack, Divider, Button, CircularProgress
} from '@mui/material';
import { AuthContext } from '../../../GlobalContext';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import MicIcon from '@mui/icons-material/Mic';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import DirectionsBikeRounded from '@mui/icons-material/DirectionsBikeRounded';
import FastfoodRounded from '@mui/icons-material/FastfoodRounded';

const ZOMATO_GREEN = '#257d3d';
const ZOMATO_RED = '#ef4f5f';
const ZOMATO_BG = '#f4f4f4';

const getStatusInfo = (status) => {
  switch (status) {
    case 'pending':       return { label: 'Preparing the order', color: ZOMATO_GREEN, icon: <AccessTimeIcon /> };
    case 'accepted':      return { label: 'Chef is cooking!', color: ZOMATO_GREEN, icon: <FastfoodRounded /> };
    case 'preparing':     return { label: 'Chef is cooking!', color: ZOMATO_GREEN, icon: <FastfoodRounded /> };
    case 'ready':         return { label: 'Ready for Pickup!', color: ZOMATO_GREEN, icon: <CheckCircleOutlineIcon /> };
    case 'out_for_delivery': return { label: 'On the way!', color: '#1c1c1c', icon: <LocalShippingIcon /> };
    case 'delivered':     return { label: 'Delivered! Enjoy 😋', color: ZOMATO_GREEN, icon: <CheckCircleOutlineIcon /> };
    case 'rejected':      return { label: 'Order Cancelled', color: ZOMATO_RED, icon: <CheckCircleOutlineIcon /> };
    default:              return { label: 'Processing...', color: '#6366f1', icon: <AccessTimeIcon /> };
  }
};

export default function TrackOrder() {
  const { id } = useParams();
  const { host } = useContext(AuthContext);
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastStatus, setLastStatus] = useState(null);

  useEffect(() => {
    if (!id) return;
    const token = JSON.parse(localStorage.getItem('userToken'));
    axios.get(`${host}/api/user/getSingleRequest/${id}`, {
      headers: { 'auth-token': token }
    })
      .then(res => {
        const fetchedOrder = res.data.request || res.data;
        setOrder(fetchedOrder);
        setLastStatus(fetchedOrder.status);
        setLoading(false);
      })
      .catch(() => setLoading(false));

    // Poll every 10 seconds for live updates
    const interval = setInterval(() => {
      axios.get(`${host}/api/user/getSingleRequest/${id}`, {
        headers: { 'auth-token': token }
      }).then(res => {
        const fetchedOrder = res.data.request || res.data;
        if (lastStatus && fetchedOrder.status !== lastStatus) {
            if (fetchedOrder.status === 'delivered') {
                toast.success('Your order has been delivered! Enjoy your meal 🥳', { duration: 6000, style: { fontSize: '1.1rem', fontWeight: 800 } });
            } else if (fetchedOrder.status === 'out_for_delivery') {
                toast.success('Your courier is on the way!', { icon: '🚚' });
            } else if (fetchedOrder.status === 'ready') {
                toast.success('Your food is cooked and ready for pickup!');
            }
            setLastStatus(fetchedOrder.status);
        }
        setOrder(fetchedOrder);
      }).catch(() => {});
    }, 10000);

    return () => clearInterval(interval);
  }, [id, host, lastStatus]);

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: ZOMATO_BG }}>
      <CircularProgress sx={{ color: ZOMATO_GREEN }} size={60} />
    </Box>
  );

  if (!order) return (
    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: ZOMATO_BG, gap: 2 }}>
      <Typography variant="h5" fontWeight={700}>Order not found.</Typography>
      <Button onClick={() => navigate('/')} startIcon={<ArrowBackIcon />} variant="contained" sx={{ bgcolor: ZOMATO_RED, borderRadius: '12px' }}>Go Home</Button>
    </Box>
  );

  const statusInfo = getStatusInfo(order.status);

  return (
    <Box sx={{ bgcolor: ZOMATO_BG, minHeight: '100vh', pb: 6, pt: { xs: 7, md: 8 } }}>
      <Toaster position="top-right" />
      <Box sx={{ maxWidth: 600, mx: 'auto' }}>

        {/* Back button */}
        <Box sx={{ pt: 2, px: 2 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/orders')}
            sx={{ color: ZOMATO_RED, fontWeight: 700, textTransform: 'none' }}
          >
            View All Orders
          </Button>
        </Box>

        {/* Zomato-style Status Banner */}
        <Box sx={{ bgcolor: statusInfo.color, color: 'white', p: 3, pt: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, textAlign: 'center', letterSpacing: '-0.5px' }}>
            {statusInfo.label}
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
            {order.status !== 'delivered' && order.status !== 'rejected' && (
              <>
                <Paper sx={{ bgcolor: 'rgba(255,255,255,0.15)', color: 'white', px: 1.5, py: 0.5, borderRadius: '8px', display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AccessTimeIcon fontSize="small" />
                  <Typography variant="caption" sx={{ fontWeight: 700 }}>On time</Typography>
                </Paper>
                <Paper sx={{ bgcolor: 'rgba(255,255,255,0.15)', color: 'white', px: 1.5, py: 0.5, borderRadius: '8px' }}>
                  <Typography variant="caption" sx={{ fontWeight: 700 }}>
                    {order.status === 'out_for_delivery' ? 'Arriving any minute now' : 'Your order is coming in 20 mins'}
                  </Typography>
                </Paper>
              </>
            )}
            {order.status === 'delivered' && (
              <Paper sx={{ bgcolor: 'rgba(255,255,255,0.15)', color: 'white', px: 2, py: 0.5, borderRadius: '8px' }}>
                <Typography variant="caption" sx={{ fontWeight: 700 }}>Order Delivered Successfully</Typography>
              </Paper>
            )}
          </Box>
        </Box>

        {/* Gift ribbon strip */}
        <Box sx={{ bgcolor: '#fff5f6', p: 2, display: 'flex', alignItems: 'center', gap: 2, borderBottom: '1px solid #fee2e2' }}>
          <Avatar sx={{ bgcolor: ZOMATO_RED, width: 32, height: 32, fontSize: '1rem' }}>🎁</Avatar>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>This is a premium order for {order.name}</Typography>
        </Box>

        {/* Main card */}
        <Box sx={{ bgcolor: 'white', p: 3 }}>
          <Stack spacing={3}>

            {/* Customer info */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: '#f1f1f1', color: ZOMATO_RED, width: 48, height: 48 }}>👨</Avatar>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{order.name}, {order.phone?.slice(0, 7)}XXX</Typography>
                <Typography variant="caption" sx={{ color: 'gray' }}>Ordering from Dining Dynamics</Typography>
              </Box>
            </Box>

            {/* Delivery partner if assigned */}
            {order.deliveryBy && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2.5, bgcolor: '#f0fdf4', borderRadius: '20px', border: '1px solid #dcfce7' }}>
                <Avatar sx={{ bgcolor: '#10b981', color: 'white', width: 44, height: 44 }}>
                  <DirectionsBikeRounded />
                </Avatar>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#166534', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Delivery Partner Assigned</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: '#14532d', lineHeight: 1.2 }}>{order.deliveryBy?.name || order.deliveryBy} is {order.status === 'out_for_delivery' ? 'bringing your order!' : 'assigned to you'}</Typography>
                </Box>
              </Box>
            )}

            <Divider />

            {/* Address */}
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Avatar sx={{ bgcolor: '#f1f1f1', color: ZOMATO_RED, width: 40, height: 40 }}>
                <LocationOnIcon fontSize="small" />
              </Avatar>
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Delivery address</Typography>
                <Typography variant="body2" sx={{ color: 'gray', mb: 0.5 }}>
                  {order.address}, {order.city} - {order.postalCode}
                </Typography>
                <Button variant="text" sx={{ color: ZOMATO_RED, p: 0, textTransform: 'none', fontWeight: 600, minWidth: 0 }}>
                  Change address <ArrowForwardIosIcon sx={{ fontSize: 10, ml: 0.5 }} />
                </Button>
              </Box>
            </Box>

            {/* Record instructions button */}
            <Button
              fullWidth
              variant="contained"
              startIcon={<MicIcon />}
              sx={{ bgcolor: ZOMATO_RED, borderRadius: '12px', py: 1.5, textTransform: 'none', fontWeight: 700, '&:hover': { bgcolor: '#d63f4e' } }}
            >
              Record delivery instructions
            </Button>

            {/* Items */}
            <Box sx={{ py: 1 }}>
              <Typography variant="overline" sx={{ fontWeight: 800, color: 'gray' }}>Your Items</Typography>
              {order.products?.map((p, i) => (
                <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{p.name} x {p.quantity}</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>₹{p.total || p.price}</Typography>
                </Box>
              ))}
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>Total Paid</Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: ZOMATO_GREEN }}>₹{order.totalamount}</Typography>
              </Box>
            </Box>

            <Divider />

            {/* Help */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 1 }}>
              <HelpOutlineIcon sx={{ color: 'gray' }} />
              <Box>
                <Typography variant="body1" sx={{ fontWeight: 700 }}>Need help with your order?</Typography>
                <Typography variant="caption" sx={{ color: ZOMATO_RED, fontWeight: 700 }}>
                  Get help & support <ArrowForwardIosIcon sx={{ fontSize: 8 }} />
                </Typography>
              </Box>
            </Box>

          </Stack>
        </Box>
      </Box>
    </Box>
  );
}
