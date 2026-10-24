import React, { useContext, useEffect, useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Stack, 
  Avatar, 
  Chip, 
  Grid, 
  Button,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { AuthContext } from '../../GlobalContext';
import moment from 'moment';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { 
  LocalShippingRounded, 
  CheckCircleRounded, 
  PersonRounded, 
  PhoneRounded, 
  HomeRounded,
  AccessTimeRounded,
  FastfoodRounded,
  ReceiptRounded as ReceiptRoundedIcon,
  DirectionsBikeRounded
} from '@mui/icons-material';

const OrderItem = ({ order, host, setAssignedCount, onPickUp }) => {
  const handleStatusUpdate = async (newStatus) => {
    try {
      const token = JSON.parse(sessionStorage.getItem('deliveryToken'));
      const res = await axios.put(`${host}/api/user/deliveryUpdateRequest/${order._id}`, { status: newStatus }, { 
        headers: { 'auth-token': token } 
      });
      if (res.data.status) {
        toast.success(`Order marked as ${newStatus}`);
        setAssignedCount(prev => prev + 1);
        if (newStatus === 'out_for_delivery') {
            onPickUp(order);
        }
      } else {
        toast.error(res.data.message || 'Failed to update order status');
      }
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  return (
    <Paper 
      elevation={0} 
      sx={{ 
        mb: 3, 
        p: 3, 
        borderRadius: '24px', 
        border: '1px solid #e2e8f0',
      }}
    >
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Stack spacing={2}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Avatar sx={{ bgcolor: '#f59e0b', borderRadius: '12px' }}>
                <ReceiptRoundedIcon />
              </Avatar>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                Order #{order._id.slice(-6).toUpperCase()}
              </Typography>
            </Box>
            
            <Stack spacing={1}>
              <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 700 }}>
                <PersonRounded sx={{ fontSize: 18, color: '#f59e0b' }} /> {order.name}
              </Typography>
              <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#64748b' }}>
                <PhoneRounded sx={{ fontSize: 16 }} /> {order.phone}
              </Typography>
              <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#64748b' }}>
                <HomeRounded sx={{ fontSize: 16 }} /> {order.address}, {order.city}
              </Typography>
            </Stack>
          </Stack>
        </Grid>

        <Grid item xs={12} md={5}>
          <Typography variant="overline" sx={{ fontWeight: 800, color: '#94a3b8' }}>Items</Typography>
          <Stack spacing={1} sx={{ mt: 1 }}>
            {order.products.map((p, i) => (
              <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2">{p.name} x {p.quantity || 1}</Typography>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>₹{p.price}</Typography>
              </Box>
            ))}
            <Divider sx={{ my: 1 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>Total</Typography>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#10b981' }}>₹{order.totalamount}</Typography>
            </Box>
          </Stack>
        </Grid>

        <Grid item xs={12} md={3} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
          <Stack spacing={2} sx={{ width: '100%' }}>
            {order.status === 'ready' || order.status === 'accepted' || order.status === 'preparing' ? (
              <Button 
                variant="contained" 
                fullWidth
                startIcon={<LocalShippingRounded />}
                onClick={() => handleStatusUpdate('out_for_delivery')}
                sx={{ bgcolor: '#3b82f6', borderRadius: '12px', py: 1.5, fontWeight: 700 }}
              >
                Pick Up Order
              </Button>
            ) : order.status === 'out_for_delivery' ? (
              <Button 
                variant="contained" 
                fullWidth
                startIcon={<CheckCircleRounded />}
                onClick={() => onPickUp(order)}
                sx={{ bgcolor: '#10b981', borderRadius: '12px', py: 1.5, fontWeight: 700 }}
              >
                Mark Delivered
              </Button>
            ) : (
              <Chip 
                label={order.status.toUpperCase()} 
                color="success" 
                sx={{ fontWeight: 800, py: 2, borderRadius: '12px' }} 
              />
            )}
          </Stack>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default function DeliveryOrders() {
  const { deliveryOrders, host, setAssignedCount } = useContext(AuthContext);
  const [activeOrder, setActiveOrder] = useState(null);

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const token = JSON.parse(sessionStorage.getItem('deliveryToken'));
      const res = await axios.put(`${host}/api/user/deliveryUpdateRequest/${orderId}`, { status: newStatus }, { 
        headers: { 'auth-token': token } 
      });
      if (res.data.status) {
        toast.success(`Order marked as ${newStatus}`);
        setAssignedCount(prev => prev + 1);
        if (newStatus === 'delivered') setActiveOrder(null);
      } else {
        toast.error(res.data.message || 'Failed to update order status');
      }
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Toaster position="top-right" />
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" sx={{ fontWeight: 800, color: '#10b981' }}>Courier Dock</Typography>
        <Typography variant="body1" sx={{ color: '#64748b' }}>Manage your active delivery tasks.</Typography>
      </Box>

      {deliveryOrders.length > 0 ? (
        deliveryOrders.map(order => (
          <OrderItem 
            key={order._id} 
            order={order} 
            host={host} 
            setAssignedCount={setAssignedCount} 
            onPickUp={(o) => setActiveOrder(o)}
          />
        ))
      ) : (
        <Box sx={{ py: 10, textAlign: 'center', bgcolor: '#f8fafc', borderRadius: '24px', border: '1px dashed #e2e8f0' }}>
          <LocalShippingRounded sx={{ fontSize: 50, color: '#cbd5e1', mb: 2 }} />
          <Typography variant="h6" sx={{ color: '#64748b', fontWeight: 700 }}>No active deliveries assigned to you.</Typography>
        </Box>
      )}

      {/* Active Delivery Modal */}
      <Dialog 
        open={Boolean(activeOrder)} 
        onClose={() => setActiveOrder(null)}
        fullWidth
        maxWidth="sm"
        PaperProps={{
            sx: { borderRadius: '24px', p: 1 }
        }}
      >
        {activeOrder && (
            <>
                <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h5" fontWeight={800}>Ongoing Delivery</Typography>
                    <IconButton onClick={() => setActiveOrder(null)}><CloseIcon /></IconButton>
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ bgcolor: '#f0fdf4', p: 3, borderRadius: '20px', mb: 3 }}>
                        <Typography variant="overline" color="primary" fontWeight={800}>On the way to</Typography>
                        <Stack spacing={1} sx={{ mt: 1 }}>
                            <Typography variant="h6" fontWeight={800}>{activeOrder.address}</Typography>
                            <Typography variant="body2" color="text.secondary">{activeOrder.city}, {activeOrder.postalCode}</Typography>
                            <Divider sx={{ my: 1 }} />
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Avatar sx={{ width: 24, height: 24, bgcolor: '#10b981' }}><PersonRounded sx={{ fontSize: 14 }} /></Avatar>
                                <Typography variant="subtitle2" fontWeight={700}>{activeOrder.name}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Avatar sx={{ width: 24, height: 24, bgcolor: '#3b82f6' }}><PhoneRounded sx={{ fontSize: 14 }} /></Avatar>
                                <Typography variant="subtitle2" fontWeight={700}>{activeOrder.phone}</Typography>
                            </Box>
                        </Stack>
                    </Box>

                    <Typography variant="subtitle2" fontWeight={800} gutterBottom>Order Summary</Typography>
                    <Stack spacing={1}>
                        {activeOrder.products.map((p, i) => (
                            <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="body2">{p.name} x {p.quantity}</Typography>
                                <Typography variant="body2" fontWeight={700}>₹{p.price}</Typography>
                            </Box>
                        ))}
                        <Divider />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="h6" fontWeight={800}>Total to Collect</Typography>
                            <Typography variant="h6" fontWeight={800} color="#10b981">₹{activeOrder.totalamount}</Typography>
                        </Box>
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button 
                        fullWidth 
                        variant="contained" 
                        size="large"
                        startIcon={<CheckCircleRounded />}
                        onClick={() => handleStatusUpdate(activeOrder._id, 'delivered')}
                        sx={{ bgcolor: '#10b981', borderRadius: '16px', py: 2, fontWeight: 800, fontSize: '1rem' }}
                    >
                        COMPLETE DELIVERY
                    </Button>
                </DialogActions>
            </>
        )}
      </Dialog>
    </Box>
  );
}

