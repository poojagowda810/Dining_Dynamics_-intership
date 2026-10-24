import React, { useContext, useState } from 'react';
import { 
  Box, 
  Tabs, 
  Tab, 
  Typography, 
  Button, 
  Paper, 
  Divider, 
  Stack, 
  Avatar, 
  Chip,
  Grid,
  FormControl,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { AuthContext } from '../../../../GlobalContext';
import moment from 'moment';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { 
  PersonRounded, 
  EmailRounded, 
  PhoneRounded, 
  HomeRounded,
  AccessTimeRounded,
  CheckCircleRounded,
  CancelRounded,
  PendingRounded,
  TableBarRounded,
  LocalShippingRounded,
  FastfoodRounded,
  ReceiptRounded as ReceiptRoundedIcon,
  ChatBubbleOutlineRounded as FeedbackIcon
} from '@mui/icons-material';

// TabPanel Component
function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`request-tabpanel-${index}`}
      aria-labelledby={`request-tab-${index}`}
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

const ReservationItem = ({ reservation, imagePath, handleAction, isPending, isRejected, isAccepted, deliveryBoys, assignDeliveryBoy }) => {
  const [selectedDeliveryBoy, setSelectedDeliveryBoy] = useState(reservation.deliveryBy?._id || '');
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const totalAmount = reservation.products.reduce((total, product) => total + (product.price * (product.quantity || 1)), 0);

  const handleAssign = () => {
    if (!selectedDeliveryBoy) {
      toast.error('Select a delivery boy first');
      return;
    }
    assignDeliveryBoy(reservation._id, selectedDeliveryBoy).then(res => {
      if (res) toast.success('Delivery boy assigned!');
    });
  };

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
        {/* Header Section: Table and User Info */}
        <Grid item xs={12} md={4}>
          <Stack spacing={3}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Avatar sx={{ bgcolor: '#6366f1', borderRadius: '12px' }}>
                <ReceiptRoundedIcon />
              </Avatar>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#1e293b' }}>
                Order #{reservation._id.slice(-6).toUpperCase()}
              </Typography>
            </Box>

            <Stack spacing={1.5} sx={{ pl: 0.5 }}>
              <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: '#1e293b', fontWeight: 700 }}>
                <PersonRounded sx={{ fontSize: '20px', color: '#6366f1' }} /> 
                {reservation?.name || reservation?.user?.name || 'Guest User'}
              </Typography>
              <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: '#64748b' }}>
                <EmailRounded sx={{ fontSize: '18px', color: '#94a3b8' }} /> {reservation?.email || reservation?.user?.email}
              </Typography>
              <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: '#64748b' }}>
                <PhoneRounded sx={{ fontSize: '18px', color: '#94a3b8' }} /> {reservation?.phone || reservation?.user?.phone}
              </Typography>
              <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: '#64748b' }}>
                <HomeRounded sx={{ fontSize: '18px', color: '#94a3b8' }} /> 
                {reservation?.address || reservation?.user?.address} 
                {reservation?.city && `, ${reservation.city}`}
                {reservation?.postalCode && ` - ${reservation.postalCode}`}
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 1, mt: 1, alignItems: 'center' }}>
                <Chip 
                  label={reservation?.method?.toUpperCase() || 'CASH'} 
                  size="small" 
                  variant="outlined"
                  sx={{ fontWeight: 700, fontSize: '0.65rem', color: '#6366f1', borderColor: '#e0e7ff', bgcolor: '#f5f7ff' }} 
                />
                {reservation.transactionId && (
                  <Chip 
                    icon={<ReceiptRoundedIcon sx={{ fontSize: '11px !important', color: '#059669 !important' }} />}
                    label={reservation.transactionId} 
                    size="small" 
                    variant="outlined"
                    sx={{ fontWeight: 700, fontSize: '0.65rem', color: '#059669', borderColor: '#d1fae5', bgcolor: '#f0fdf4' }} 
                  />
                )}
              </Box>
              <Divider sx={{ my: 1 }} />
              <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#6366f1', fontWeight: 700 }}>
                <AccessTimeRounded sx={{ fontSize: '16px' }} />
                {moment(reservation?.createdAt).format('MMM Do, YYYY | h:mm A')}
              </Typography>
            </Stack>
          </Stack>
        </Grid>

        <Grid item md="auto" sx={{ display: { xs: 'none', md: 'block' } }}>
          <Divider orientation="vertical" />
        </Grid>

        {/* Product List Content */}
        <Grid item xs={12} md={7}>
          <Typography variant="overline" sx={{ fontWeight: 800, color: '#94a3b8', mb: 2, display: 'block' }}>
            Ordered Items
          </Typography>
          
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
            {reservation.products.map((product, index) => (
              <Box 
                key={index} 
                sx={{ 
                  flex: '0 0 auto',
                  width: 160,
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
                  sx={{ width: 60, height: 60, mx: 'auto', mb: 1.5, borderRadius: '12px' }}
                />
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#1e293b', display: 'block' }} noWrap>
                  {product.name}
                </Typography>
                <Typography variant="caption" sx={{ color: '#6366f1', fontWeight: 700 }}>
                  ₹{product?.price}
                </Typography>
              </Box>
            ))}
          </Box>

            {reservation.feedback && (
              <Box sx={{ mt: 3, p: 2, bgcolor: '#f0f9ff', borderRadius: '16px', border: '1px solid #e0f2fe' }}>
                <Typography variant="caption" sx={{ fontWeight: 800, color: '#0369a1', display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                  <FeedbackIcon sx={{ fontSize: '16px' }} /> CUSTOMER FEEDBACK
                </Typography>
                <Typography variant="body2" sx={{ color: '#0c4a6e', fontStyle: 'italic' }}>
                  "{reservation.feedback}"
                </Typography>
              </Box>
            )}

          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 3, pt: 2, borderTop: '1px dashed #e2e8f0' }}>
            <Box>
              <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600, display: 'block' }}>
                ESTIMATED TOTAL
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 900, color: '#10b981' }}>
                ₹{totalAmount}
              </Typography>
            </Box>

            <Stack direction="row" spacing={1.5}>
              {isPending && (
                <>
                  <Button
                    variant="contained"
                    startIcon={<CheckCircleRounded />}
                    sx={{ p: 1.2, px: 3, borderRadius: '12px', bgcolor: '#10b981', '&:hover': { bgcolor: '#059669' }, textTransform: 'none', fontWeight: 700 }}
                    onClick={() => setAssignModalOpen(true)}
                  >
                    Accept
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<CancelRounded />}
                    sx={{ p: 1.2, px: 3, borderRadius: '12px', bgcolor: '#ef4444', '&:hover': { bgcolor: '#dc2626' }, textTransform: 'none', fontWeight: 700 }}
                    onClick={() => handleAction(reservation._id, 'rejected')}
                  >
                    Reject
                  </Button>
                </>
              )}

              {isRejected && (
                <Chip 
                  icon={<CancelRounded />} 
                  label="REJECTED" 
                  sx={{ p: 2, borderRadius: '12px', bgcolor: '#fef2f2', color: '#ef4444', fontWeight: 800, border: '1px solid #fee2e2' }} 
                />
              )}

              {isAccepted && (
                <Button
                  variant="contained"
                  startIcon={<FastfoodRounded />}
                  sx={{ p: 1.2, px: 3, borderRadius: '12px', bgcolor: '#6366f1', '&:hover': { bgcolor: '#4f46e5' }, textTransform: 'none', fontWeight: 700 }}
                  onClick={() => handleAction(reservation._id, 'preparing')}
                >
                  Mark as Preparing
                </Button>
              )}

              {reservation.status === 'preparing' && (
                <Button
                  variant="contained"
                  startIcon={<AccessTimeRounded />}
                  sx={{ p: 1.2, px: 3, borderRadius: '12px', bgcolor: '#f59e0b', '&:hover': { bgcolor: '#d97706' }, textTransform: 'none', fontWeight: 700 }}
                  onClick={() => handleAction(reservation._id, 'ready')}
                >
                  Ready for Pickup
                </Button>
              )}

              {reservation.status === 'ready' && (
                <Chip 
                  icon={<AccessTimeRounded />} 
                  label="AWAITING COURIER" 
                  sx={{ p: 2, borderRadius: '12px', bgcolor: '#fff7ed', color: '#f59e0b', fontWeight: 800, border: '1px solid #ffedd5' }} 
                />
              )}

              {reservation.status === 'out_for_delivery' && (
                <Chip 
                  icon={<LocalShippingRounded />} 
                  label="OUT FOR DELIVERY" 
                  sx={{ p: 2, borderRadius: '12px', bgcolor: '#eff6ff', color: '#3b82f6', fontWeight: 800, border: '1px solid #dbeafe' }} 
                />
              )}

              {reservation.status === 'delivered' && (
                <Chip 
                  icon={<CheckCircleRounded />} 
                  label="DELIVERED SUCCESSFULLY" 
                  sx={{ p: 2, borderRadius: '12px', bgcolor: '#f0fdf4', color: '#10b981', fontWeight: 800, border: '1px solid #dcfce7' }} 
                />
              )}
            </Stack>

            {/* Delivery Assignment Dropdown (visible if accepted and not yet out for delivery) */}
            {(reservation.status === 'accepted' || reservation.status === 'preparing' || reservation.status === 'ready') && (
              <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid #f1f5f9' }}>
                <Typography variant="caption" sx={{ fontWeight: 800, color: '#94a3b8', mb: 1, display: 'block' }}>
                  ASSIGN DELIVERY AGENT
                </Typography>
                <Stack direction="row" spacing={2} sx={{ width: '100%' }}>
                  <FormControl size="small" sx={{ flexGrow: 1 }}>
                    <Select
                      value={selectedDeliveryBoy}
                      onChange={(e) => setSelectedDeliveryBoy(e.target.value)}
                      displayEmpty
                      sx={{ 
                        borderRadius: '12px', 
                        bgcolor: '#f8fafc',
                        '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e2e8f0' }
                      }}
                    >
                      <MenuItem value="" disabled>Select Delivery Boy</MenuItem>
                      {deliveryBoys?.map(boy => (
                        <MenuItem key={boy._id} value={boy._id}>{boy.name} ({boy.phone})</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <Button 
                    variant="outlined" 
                    onClick={handleAssign}
                    sx={{ borderRadius: '12px', textTransform: 'none', fontWeight: 700, borderColor: '#6366f1', color: '#6366f1' }}
                  >
                    {reservation.deliveryBy ? 'Re-assign' : 'Assign'}
                  </Button>
                </Stack>
                {reservation.deliveryBy && (
                  <Typography variant="caption" sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 0.5, color: '#10b981', fontWeight: 600 }}>
                    <LocalShippingRounded sx={{ fontSize: 14 }} /> 
                    Assigned to: {reservation.deliveryBy.name}
                  </Typography>
                )}
              </Box>
            )}
          </Stack>
        </Grid>
      </Grid>
      
      <Dialog open={assignModalOpen} onClose={() => setAssignModalOpen(false)} PaperProps={{ sx: { borderRadius: '24px', p: 1, minWidth: '400px' } }}>
        <DialogTitle sx={{ fontWeight: 800, color: '#1e293b' }}>
          Assign Delivery Agent
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: '#475569', mb: 3 }}>
            Please select a delivery agent to deliver Order #{reservation._id.slice(-6).toUpperCase()}.
          </Typography>
          <FormControl fullWidth size="medium">
            <Select
              value={selectedDeliveryBoy}
              onChange={(e) => setSelectedDeliveryBoy(e.target.value)}
              displayEmpty
              sx={{ borderRadius: '12px', bgcolor: '#f8fafc' }}
            >
              <MenuItem value="" disabled>Select a Delivery Boy</MenuItem>
              {deliveryBoys?.map(boy => (
                <MenuItem key={boy._id} value={boy._id}>
                  {boy.name} ({boy.phone})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setAssignModalOpen(false)} sx={{ color: '#64748b', fontWeight: 700 }}>Cancel</Button>
          <Button 
            onClick={async () => {
              if (!selectedDeliveryBoy) {
                toast.error('Please select a delivery agent!');
                return;
              }
              await handleAction(reservation._id, 'accepted');
              await assignDeliveryBoy(reservation._id, selectedDeliveryBoy);
              setAssignModalOpen(false);
            }} 
            variant="contained" 
            sx={{ bgcolor: '#10b981', '&:hover': { bgcolor: '#059669' }, borderRadius: '12px', fontWeight: 700, textTransform: 'none' }}
          >
            Confirm & Accept
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};


// Main Reservation Component
export default function Reservation() {
  const { acceptedreq, rejreq, pendingreq, imagePath, host, setreqCount, deliveryBoys, assignDeliveryBoy } = useContext(AuthContext);
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleAction = async (reservationId, action) => {
    const status = {
      status: action
    };

    try {
      const token = JSON.parse(sessionStorage.getItem('adminToken'));
      const res = await axios.put(`${host}/api/admin/updateRequest/${reservationId}`, status, { headers: { 'auth-token': token } });
      if (res.data.status) {
        toast.success(`Request ${action}ed successfully`);
        setreqCount((prev) => prev + 1);
      }
    } catch (err) {
      toast.error('Operation failed');
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Toaster position="top-right" />
      
      {/* Header */}
      <Box sx={{ mb: 4 }}>
          <Typography variant="h3" sx={{ fontWeight: 800, color: '#1e293b', letterSpacing: '-0.02em' }}>
              Order Requests
          </Typography>
          <Typography variant="body1" sx={{ color: '#64748b' }}>
              Manage incoming meal orders and customer requests.
          </Typography>
      </Box>

      {/* Tabs */}
      <Tabs 
        value={tabValue} 
        onChange={handleTabChange} 
        sx={{ 
          '& .MuiTabs-indicator': { bgcolor: '#6366f1', height: 3, borderRadius: '3px 3px 0 0' },
          '& .MuiTab-root': { textTransform: 'none', fontWeight: 700, fontSize: '1rem', color: '#94a3b8' },
          '& .Mui-selected': { color: '#6366f1 !important' },
        }}
      >
        <Tab icon={<PendingRounded sx={{ mb: 0.5 }} />} iconPosition="start" label="Pending" />
        <Tab icon={<CheckCircleRounded sx={{ mb: 0.5 }} />} iconPosition="start" label="Accepted" />
        <Tab icon={<CancelRounded sx={{ mb: 0.5 }} />} iconPosition="start" label="Rejected" />
      </Tabs>

      <TabPanel value={tabValue} index={0}>
        {pendingreq?.length > 0 ? (
          <Box>
            {pendingreq.map(res => (
              <ReservationItem key={res._id} reservation={res} imagePath={imagePath} handleAction={handleAction} isPending deliveryBoys={deliveryBoys} assignDeliveryBoy={assignDeliveryBoy} />
            ))}
          </Box>
        ) : (
          <Box sx={{ py: 10, textAlign: 'center', bgcolor: '#f8fafc', borderRadius: '24px', border: '1px dashed #e2e8f0' }}>
            <PendingRounded sx={{ fontSize: 50, color: '#cbd5e1', mb: 2 }} />
            <Typography variant="h6" sx={{ color: '#64748b', fontWeight: 700 }}>No pending requests</Typography>
          </Box>
        )}
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        {acceptedreq?.length > 0 ? (
          <Box>
            {acceptedreq.map(res => (
              <ReservationItem key={res._id} reservation={res} imagePath={imagePath} handleAction={handleAction} isAccepted deliveryBoys={deliveryBoys} assignDeliveryBoy={assignDeliveryBoy} />
            ))}
          </Box>
        ) : (
          <Box sx={{ py: 10, textAlign: 'center', bgcolor: '#f8fafc', borderRadius: '24px', border: '1px dashed #e2e8f0' }}>
            <CheckCircleRounded sx={{ fontSize: 50, color: '#cbd5e1', mb: 2 }} />
            <Typography variant="h6" sx={{ color: '#64748b', fontWeight: 700 }}>No accepted requests</Typography>
          </Box>
        )}
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        {rejreq?.length > 0 ? (
          <Box>
            {rejreq.map(res => (
              <ReservationItem key={res._id} reservation={res} imagePath={imagePath} handleAction={handleAction} isRejected deliveryBoys={deliveryBoys} assignDeliveryBoy={assignDeliveryBoy} />
            ))}
          </Box>
        ) : (
          <Box sx={{ py: 10, textAlign: 'center', bgcolor: '#f8fafc', borderRadius: '24px', border: '1px dashed #e2e8f0' }}>
            <CancelRounded sx={{ fontSize: 50, color: '#cbd5e1', mb: 2 }} />
            <Typography variant="h6" sx={{ color: '#64748b', fontWeight: 700 }}>No rejected requests</Typography>
          </Box>
        )}
      </TabPanel>
    </Box>
  );
}
