import React, { useContext, useState } from 'react';
import {
  Box,
  Typography,
  Chip,
  Avatar,
  Stack,
  Divider,
  Tabs,
  Tab,
  Paper
} from '@mui/material';
import { AuthContext } from '../../../../GlobalContext';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import ReceiptIcon from '@mui/icons-material/Receipt';
import DirectionsBikeIcon from '@mui/icons-material/DirectionsBike';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

function TabPanel({ children, value, index }) {
  return (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  );
}

const statusConfig = {
  pending:          { label: 'Preparing',      color: '#f59e0b', bg: '#fef3c7', icon: <AccessTimeIcon fontSize="small" /> },
  accepted:         { label: 'Accepted',        color: '#6366f1', bg: '#ede9fe', icon: <FastfoodIcon fontSize="small" /> },
  preparing:        { label: 'Preparing',       color: '#f59e0b', bg: '#fef3c7', icon: <FastfoodIcon fontSize="small" /> },
  ready:            { label: 'Ready',           color: '#10b981', bg: '#d1fae5', icon: <CheckCircleIcon fontSize="small" /> },
  out_for_delivery: { label: 'Out for Delivery',color: '#0284c7', bg: '#e0f2fe', icon: <DirectionsBikeIcon fontSize="small" /> },
  delivered:        { label: 'Delivered',       color: '#16a34a', bg: '#dcfce7', icon: <CheckCircleIcon fontSize="small" /> },
  rejected:         { label: 'Cancelled',       color: '#ef4444', bg: '#fee2e2', icon: <CancelIcon fontSize="small" /> },
};

const OrderCard = ({ order }) => {
  const navigate = useNavigate();
  const status = statusConfig[order.status] || statusConfig.pending;

  return (
    <Paper
      elevation={0}
      onClick={() => navigate(`/track-order/${order._id}`)}
      sx={{
        p: 2.5,
        mb: 2,
        borderRadius: '20px',
        border: '1px solid #f0f0f0',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        '&:hover': { borderColor: '#6366f1', boxShadow: '0 4px 20px rgba(99,102,241,0.12)', transform: 'translateY(-2px)' }
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar sx={{ bgcolor: status.bg, color: status.color, width: 40, height: 40 }}>
            {status.icon}
          </Avatar>
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#1f2937' }}>
              Order #{order._id.slice(-6).toUpperCase()}
            </Typography>
            <Typography variant="caption" sx={{ color: '#6b7280' }}>
              {moment(order.createdAt).fromNow()}
            </Typography>
          </Box>
        </Box>
        <Chip
          label={status.label}
          size="small"
          sx={{ bgcolor: status.bg, color: status.color, fontWeight: 700, fontSize: '0.7rem' }}
        />
      </Box>

      <Divider sx={{ my: 1.5 }} />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="body2" sx={{ color: '#374151', fontWeight: 600 }}>
            {order.products?.slice(0, 2).map(p => p.name).join(', ')}
            {order.products?.length > 2 && ` +${order.products.length - 2} more`}
          </Typography>
          <Typography variant="caption" sx={{ color: '#10b981', fontWeight: 700 }}>
            ₹{order.totalamount} • {order.method === 'online' ? '💳 Online' : '💵 Cash'}
          </Typography>
        </Box>
        <ArrowForwardIosIcon sx={{ fontSize: 14, color: '#9ca3af' }} />
      </Box>
    </Paper>
  );
};

const EmptyState = ({ text }) => (
  <Box sx={{ textAlign: 'center', py: 8 }}>
    <ReceiptIcon sx={{ fontSize: 56, color: '#e5e7eb', mb: 2 }} />
    <Typography variant="body1" sx={{ color: '#9ca3af', fontWeight: 600 }}>{text}</Typography>
  </Box>
);

export default function Order() {
  const { singleusereq } = useContext(AuthContext);
  const [tabValue, setTabValue] = useState(0);

  const onlineOrders = singleusereq?.filter(r => r.method === 'online') || [];
  const cashOrders   = singleusereq?.filter(r => r.method === 'cash on delivery') || [];

  return (
    <Box>
      <Paper elevation={0} sx={{ borderRadius: '16px', border: '1px solid #f0f0f0', overflow: 'hidden' }}>
        <Tabs
          value={tabValue}
          onChange={(_, v) => setTabValue(v)}
          variant="fullWidth"
          sx={{
            '& .MuiTabs-indicator': { bgcolor: '#6366f1', height: 3 },
            '& .MuiTab-root': { fontWeight: 700, textTransform: 'none', py: 2, fontSize: '0.95rem', color: '#6b7280' },
            '& .Mui-selected': { color: '#6366f1 !important' }
          }}
        >
          <Tab label={`💳 Online (${onlineOrders.length})`} />
          <Tab label={`💵 Cash (${cashOrders.length})`} />
        </Tabs>
      </Paper>

      <TabPanel value={tabValue} index={0}>
        {onlineOrders.length > 0
          ? onlineOrders.map(o => <OrderCard key={o._id} order={o} />)
          : <EmptyState text="No online orders yet. Place your first order!" />}
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        {cashOrders.length > 0
          ? cashOrders.map(o => <OrderCard key={o._id} order={o} />)
          : <EmptyState text="No cash orders yet." />}
      </TabPanel>
    </Box>
  );
}