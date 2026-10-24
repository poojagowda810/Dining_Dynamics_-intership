import React, { useContext, useState } from 'react';
import { 
  Box, 
  Tabs, 
  Tab, 
  Typography, 
  Paper, 
  Divider, 
  Stack, 
  Avatar, 
  Chip,
  Grid
} from '@mui/material';
import { AuthContext } from '../../../../GlobalContext';
import moment from 'moment';
import { 
  PersonRounded, 
  EmailRounded, 
  PhoneRounded, 
  HomeRounded,
  LocalMallRounded,
  PaymentRounded,
  AccountBalanceWalletRounded
} from '@mui/icons-material';

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`order-tabpanel-${index}`}
      aria-labelledby={`order-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const OrderItem = ({ order, imagePath }) => {
  const totalAmount = order.totalamount || order.products.reduce((acc, product) => acc + (product.total || product.price), 0);

  return (
    <Paper 
      elevation={0} 
      sx={{ 
        mb: 3, 
        p: 3, 
        borderRadius: '24px', 
        border: '1px solid #e2e8f0',
        transition: 'transform 0.2s',
        '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 4px 20px -5px rgba(0,0,0,0.05)' }
      }}
    >
      <Grid container spacing={3}>
        {/* User Info Column */}
        <Grid item xs={12} md={4}>
          <Stack spacing={2}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar sx={{ bgcolor: '#6366f1', width: 40, height: 40 }}>
                <PersonRounded />
              </Avatar>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1e293b' }}>
                  {order.user.name || 'Anonymous User'}
                </Typography>
                <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600 }}>
                  Order ID: #{order._id.slice(-6).toUpperCase()}
                </Typography>
              </Box>
            </Stack>
            
            <Stack spacing={1} sx={{ pl: 1 }}>
              <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: '#475569' }}>
                <EmailRounded sx={{ fontSize: '18px', color: '#94a3b8' }} /> {order.user.email}
              </Typography>
              <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: '#475569' }}>
                <PhoneRounded sx={{ fontSize: '18px', color: '#94a3b8' }} /> {order.user.phone}
              </Typography>
              <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: '#475569' }}>
                <HomeRounded sx={{ fontSize: '18px', color: '#94a3b8' }} /> {order.user.address}
              </Typography>
            </Stack>
          </Stack>
        </Grid>

        {/* Vertical Divider for Desktop */}
        <Grid item md="auto" sx={{ display: { xs: 'none', md: 'block' } }}>
          <Divider orientation="vertical" />
        </Grid>

        {/* Product List Content */}
        <Grid item xs={12} md={7}>
          <Box 
            sx={{ 
              display: 'flex', 
              gap: 2, 
              overflowX: 'auto', 
              pb: 2,
              '::-webkit-scrollbar': { height: '6px' },
              '::-webkit-scrollbar-thumb': { bgcolor: '#e2e8f0', borderRadius: '10px' }
            }}
          >
            {order.products.map((product, idx) => (
              <Box 
                key={idx} 
                sx={{ 
                  flex: '0 0 auto',
                  width: 180,
                  p: 2,
                  borderRadius: '16px',
                  bgcolor: '#f8fafc',
                  border: '1px solid #f1f5f9',
                  textAlign: 'center'
                }}
              >
                <Avatar
                  src={`${imagePath}/${product.image}`}
                  variant="rounded"
                  sx={{ width: 80, height: 80, mx: 'auto', mb: 1.5, borderRadius: '12px' }}
                />
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1e293b' }} noWrap>
                  {product.name}
                </Typography>
                <Typography variant="caption" display="block" sx={{ color: '#64748b', mb: 0.5 }}>
                  Qty: {product.quantity || 1}
                </Typography>
                <Chip 
                  label={`₹${product.total || product.price}`} 
                  size="small" 
                  sx={{ fontWeight: 700, bgcolor: 'white', border: '1px solid #e2e8f0' }} 
                />
              </Box>
            ))}
          </Box>

          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 3, pt: 2, borderTop: '1px dashed #e2e8f0' }}>
            <Box>
              <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600, display: 'block' }}>
                PLACED ON
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 700, color: '#475569' }}>
                {moment(order.createdAt).format('MMM Do, YYYY | h:mm A')}
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600, display: 'block' }}>
                GRAND TOTAL
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 900, color: '#10b981' }}>
                ₹{totalAmount}
              </Typography>
            </Box>
          </Stack>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default function Order() {
  const { onlinepay, offlinepay, imagePath } = useContext(AuthContext);
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
          <Typography variant="h3" sx={{ fontWeight: 800, color: '#1e293b', letterSpacing: '-0.02em' }}>
              Order Management
          </Typography>
          <Typography variant="body1" sx={{ color: '#64748b' }}>
              Track and monitor all transactions flowing through your restaurant.
          </Typography>
      </Box>

      {/* Modern Tabs */}
      <Tabs 
        value={tabValue} 
        onChange={handleTabChange} 
        sx={{ 
          '& .MuiTabs-indicator': { bgcolor: '#6366f1', height: 3, borderRadius: '3px 3px 0 0' },
          '& .MuiTab-root': { textTransform: 'none', fontWeight: 700, fontSize: '1rem', minWidth: 150, color: '#94a3b8' },
          '& .Mui-selected': { color: '#6366f1 !important' },
        }}
      >
        <Tab icon={<PaymentRounded sx={{ mb: 0.5 }} />} iconPosition="start" label="Online Payments" />
        <Tab icon={<AccountBalanceWalletRounded sx={{ mb: 0.5 }} />} iconPosition="start" label="Cash on Delivery" />
      </Tabs>

      <TabPanel value={tabValue} index={0}>
        {onlinepay?.length > 0 ? (
          <Box>
            {onlinepay.map(order => (
              <OrderItem 
                key={order._id}
                order={order}
                imagePath={imagePath}
              />
            ))}
          </Box>
        ) : (
          <Box sx={{ py: 10, textAlign: 'center', bgcolor: '#f8fafc', borderRadius: '24px', border: '1px dashed #e2e8f0' }}>
            <LocalMallRounded sx={{ fontSize: 50, color: '#cbd5e1', mb: 2 }} />
            <Typography variant="h6" sx={{ color: '#64748b', fontWeight: 700 }}>No online orders yet</Typography>
          </Box>
        )}
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        {offlinepay?.length > 0 ? (
          <Box>
            {offlinepay.map(order => (
              <OrderItem 
                key={order._id}
                order={order}
                imagePath={imagePath}
              />
            ))}
          </Box>
        ) : (
          <Box sx={{ py: 10, textAlign: 'center', bgcolor: '#f8fafc', borderRadius: '24px', border: '1px dashed #e2e8f0' }}>
            <LocalMallRounded sx={{ fontSize: 50, color: '#cbd5e1', mb: 2 }} />
            <Typography variant="h6" sx={{ color: '#64748b', fontWeight: 700 }}>No COD orders yet</Typography>
          </Box>
        )}
      </TabPanel>
    </Box>
  );
}
