import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Button, 
  Paper, 
  Stack, 
  Avatar, 
  Chip, 
  Grid,
  Tabs,
  Tab,
  Container,
  Divider,
  IconButton
} from '@mui/material';
import { 
  LocalShippingRounded, 
  CheckCircleRounded, 
  PersonRounded, 
  HomeRounded, 
  PhoneRounded, 
  ExitToAppRounded,
  FastfoodRounded,
  DirectionsBikeRounded
} from '@mui/icons-material';
import axios from 'axios';
import { AuthContext } from '../GlobalContext';
import toast, { Toaster } from 'react-hot-toast';
import moment from 'moment';

const TabPanel = ({ children, value, index }) => (
  <div hidden={value !== index} style={{ padding: '24px 0' }}>
    {value === index && children}
  </div>
);

export default function DeliveryDashboard() {
  const navigate = useNavigate();
  const { host, user } = useContext(AuthContext);
  const [tabValue, setTabValue] = useState(0);
  const [availableOrders, setAvailableOrders] = useState([]);
  const [myOrders, setMyOrders] = useState([]);

  const fetchOrders = React.useCallback(async () => {
    try {
      const token = JSON.parse(sessionStorage.getItem('deliveryToken'));
      const config = { headers: { 'auth-token': token } };
      
      const availRes = await axios.get(`${host}/api/delivery/available`, config);
      const myRes = await axios.get(`${host}/api/delivery/my-orders`, config);
      
      setAvailableOrders(availRes.data.orders || []);
      setMyOrders(myRes.data.orders || []);
    } catch (err) {
      toast.error('Failed to fetch orders');
    }
  }, [host]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleAccept = async (orderId) => {
    try {
      const token = JSON.parse(sessionStorage.getItem('deliveryToken'));
      await axios.post(`${host}/api/delivery/accept`, { orderId }, { headers: { 'auth-token': token } });
      toast.success('Order accepted! Head to the restaurant.');
      fetchOrders();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to accept order');
    }
  };

  const handleComplete = async (orderId) => {
    try {
      const token = JSON.parse(sessionStorage.getItem('deliveryToken'));
      await axios.post(`${host}/api/delivery/complete`, { orderId }, { headers: { 'auth-token': token } });
      toast.success('Delivery successful! Great job.');
      fetchOrders();
    } catch (err) {
      toast.error('Failed to complete delivery');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('deliveryToken');
    navigate('/delivery/login');
  };

  const activeDeliveries = myOrders.filter(o => o.deliveryStatus === 'accepted');
  const pastDeliveries = myOrders.filter(o => o.deliveryStatus === 'delivered');

  return (
    <Box sx={{ bgcolor: '#f8fafc', minHeight: '100vh', pb: 10 }}>
      <Toaster position="top-right" />
      
      {/* Premium Header */}
      <Box sx={{ bgcolor: '#ffffff', borderBottom: '1px solid #e2e8f0', py: 2, position: 'sticky', top: 0, zIndex: 1000 }}>
        <Container maxWidth="md">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: '#6366f1', width: 45, height: 45 }}>
                <DirectionsBikeRounded />
              </Avatar>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#1e293b' }}>Courier Dashboard</Typography>
                <Typography variant="caption" sx={{ color: '#6366f1', fontWeight: 700 }}>Online • {user?.name}</Typography>
              </Box>
            </Box>
            <IconButton onClick={handleLogout} sx={{ color: '#ef4444', bgcolor: '#fef2f2', '&:hover': { bgcolor: '#fee2e2' } }}>
              <ExitToAppRounded />
            </IconButton>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="md" sx={{ mt: 3 }}>
        <Paper elevation={0} sx={{ borderRadius: '20px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          <Tabs 
            value={tabValue} 
            onChange={(e, v) => setTabValue(v)} 
            variant="fullWidth"
            sx={{ 
              bgcolor: '#fff',
              '& .MuiTabs-indicator': { bgcolor: '#6366f1', height: 3 },
              '& .MuiTab-root': { fontWeight: 700, textTransform: 'none', py: 2 }
            }}
          >
            <Tab label={`Available (${availableOrders.length})`} />
            <Tab label={`My Tasks (${activeDeliveries.length})`} />
            <Tab label="History" />
          </Tabs>

          <TabPanel value={tabValue} index={0}>
            <Stack spacing={2} sx={{ px: 2 }}>
              {availableOrders.length > 0 ? availableOrders.map(order => (
                <OrderCard key={order._id} order={order} onAction={() => handleAccept(order._id)} actionText="Pick-up Order" actionIcon={<CheckCircleRounded />} themeColor="#6366f1" />
              )) : <EmptyState icon={<FastfoodRounded />} text="Waiting for new orders from the kitchen..." />}
            </Stack>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Stack spacing={2} sx={{ px: 2 }}>
              {activeDeliveries.length > 0 ? activeDeliveries.map(order => (
                <OrderCard key={order._id} order={order} onAction={() => handleComplete(order._id)} actionText="Mark as Delivered" actionIcon={<LocalShippingRounded />} themeColor="#10b981" isActive />
              )) : <EmptyState icon={<DirectionsBikeRounded />} text="No active deliveries. Pick some up!" />}
            </Stack>
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <Box sx={{ px: 2, mb: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Paper elevation={0} sx={{ p: 2, borderRadius: '16px', bgcolor: '#f0fdf4', border: '1px solid #dcfce7', textAlign: 'center' }}>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: '#16a34a', textTransform: 'uppercase' }}>Total Deliveries</Typography>
                    <Typography variant="h4" sx={{ fontWeight: 900, color: '#16a34a' }}>{pastDeliveries.length}</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6}>
                  <Paper elevation={0} sx={{ p: 2, borderRadius: '16px', bgcolor: '#f5f7ff', border: '1px solid #e0e7ff', textAlign: 'center' }}>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: '#6366f1', textTransform: 'uppercase' }}>Estimated Earnings</Typography>
                    <Typography variant="h4" sx={{ fontWeight: 900, color: '#6366f1' }}>₹{pastDeliveries.length * 50}</Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Box>
            <Divider sx={{ mb: 3, borderStyle: 'dashed' }} />
            <Stack spacing={2} sx={{ px: 2 }}>
              {pastDeliveries.length > 0 ? pastDeliveries.map(order => (
                <OrderCard key={order._id} order={order} isHistory />
              )) : <EmptyState icon={<CheckCircleRounded />} text="Your delivery history will appear here." />}
            </Stack>
          </TabPanel>
        </Paper>
      </Container>
    </Box>
  );
}

const OrderCard = ({ order, onAction, actionText, actionIcon, themeColor, isActive, isHistory }) => (
  <Paper 
    elevation={0} 
    sx={{ 
      p: 3, 
      borderRadius: '20px', 
      border: '1px solid #e2e8f0', 
      bgcolor: isActive ? '#f0f9ff' : '#fff',
      transition: 'all 0.2s ease',
      '&:hover': { borderColor: themeColor }
    }}
  >
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
      <Box>
        <Typography variant="overline" sx={{ fontWeight: 800, color: '#94a3b8' }}>Order #{order._id.slice(-6).toUpperCase()}</Typography>
        <Typography variant="h6" sx={{ fontWeight: 800, color: '#1e293b' }}>₹{order.totalamount}</Typography>
      </Box>
      <Chip 
        label={isActive ? 'PICKED UP' : (isHistory ? 'DELIVERED' : 'READY')} 
        size="small" 
        sx={{ 
          fontWeight: 800, 
          fontSize: '0.65rem', 
          bgcolor: isHistory ? '#f0fdf4' : (isActive ? '#e0f2fe' : '#fff7ed'),
          color: isHistory ? '#10b981' : (isActive ? '#0369a1' : '#f59e0b') 
        }} 
      />
    </Box>

    <Stack spacing={1.5} sx={{ mb: 3 }}>
      <DetailItem icon={<PersonRounded />} label={order.name || order.user?.name} />
      <DetailItem icon={<PhoneRounded />} label={order.phone} />
      <DetailItem icon={<HomeRounded />} label={`${order.address}, ${order.city}`} />
    </Stack>

    <Divider sx={{ mb: 2, borderStyle: 'dashed' }} />
    
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600 }}>
        {moment(order.createdAt).fromNow()}
      </Typography>
      {!isHistory && (
        <Button 
          variant="contained" 
          startIcon={actionIcon}
          onClick={onAction}
          sx={{ 
            borderRadius: '12px', 
            bgcolor: themeColor, 
            '&:hover': { bgcolor: themeColor },
            textTransform: 'none',
            fontWeight: 700,
            px: 3
          }}
        >
          {actionText}
        </Button>
      )}
    </Box>
  </Paper>
);

const DetailItem = ({ icon, label }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
    {React.cloneElement(icon, { sx: { fontSize: 18, color: '#94a3b8' } })}
    <Typography variant="body2" sx={{ color: '#475569', fontWeight: 600 }}>{label}</Typography>
  </Box>
);

const EmptyState = ({ icon, text }) => (
  <Box sx={{ py: 8, textAlign: 'center' }}>
    {React.cloneElement(icon, { sx: { fontSize: 48, color: '#cbd5e1', mb: 2 } })}
    <Typography variant="body1" sx={{ color: '#94a3b8', fontWeight: 600 }}>{text}</Typography>
  </Box>
);
