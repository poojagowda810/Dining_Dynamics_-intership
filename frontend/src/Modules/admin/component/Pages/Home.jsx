import React, { useContext } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  tableCellClasses,
  Avatar,
  Stack,
  Chip
} from '@mui/material';
import { AuthContext } from '../../../GlobalContext';
import moment from 'moment';
import { styled } from '@mui/system';
import ShoppingBagRoundedIcon from '@mui/icons-material/ShoppingBagRounded';
import GroupRoundedIcon from '@mui/icons-material/GroupRounded';
import PendingActionsRoundedIcon from '@mui/icons-material/PendingActionsRounded';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#f8fafc",
    color: "#475569",
    textAlign: 'center',
    fontWeight: 700,
    fontSize: '0.85rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    borderBottom: '1px solid #e2e8f0',
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: '0.9rem',
    textAlign: 'center',
    color: '#1e293b',
    padding: '16px',
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:hover': {
    backgroundColor: '#f1f5f9',
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const StatCard = ({ title, value, icon, color, gradient }) => (
  <Card
    elevation={0}
    sx={{
      p: 2,
      borderRadius: "24px",
      background: 'white',
      border: '1px solid #e2e8f0',
      transition: 'transform 0.2s',
      '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }
    }}
  >
    <CardContent>
      <Stack direction="row" spacing={2} alignItems="center" mb={2}>
        <Avatar 
          sx={{ 
            background: gradient,
            width: 48, 
            height: 48,
            boxShadow: `0 4px 12px ${color}44`
          }}
        >
          {icon}
        </Avatar>
        <Box>
          <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>
            {title}
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#1e293b' }}>
            {value}
          </Typography>
        </Box>
      </Stack>
      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
        <Typography variant="caption" sx={{ color: '#10b981', fontWeight: 700, bgcolor: '#ecfdf5', px: 1, py: 0.5, borderRadius: '6px' }}>
          +12% 
        </Typography>
        <Typography variant="caption" sx={{ ml: 1, color: '#94a3b8' }}>
          Finalized totals
        </Typography>
      </Box>
    </CardContent>
  </Card>
);

export default function Home() {
  const { orders, alluser, pendingreq, imagePath } = useContext(AuthContext);

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      {/* Dashboard Header */}
      <Box sx={{ mb: 5 }}>
        <Typography variant="h3" sx={{ fontWeight: 800, color: '#1e293b', letterSpacing: '-0.02em' }}>
          Dashboard
        </Typography>
        <Typography variant="body1" sx={{ color: '#64748b' }}>
          Welcome back! Here's what's happening today.
        </Typography>
      </Box>

      {/* Cards Section */}
      <Grid container spacing={3} mb={6}>
        <Grid item xs={12} sm={4}>
          <StatCard 
            title="Total Orders" 
            value={orders?.length || 0} 
            icon={<ShoppingBagRoundedIcon />} 
            color="#6366f1"
            gradient="linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)"
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatCard 
            title="Total Users" 
            value={alluser?.length || 0} 
            icon={<GroupRoundedIcon />} 
            color="#f59e0b"
            gradient="linear-gradient(135deg, #f59e0b 0%, #d97706 100%)"
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatCard 
            title="Pending Requests" 
            value={pendingreq?.length || 0} 
            icon={<PendingActionsRoundedIcon />} 
            color="#ec4899"
            gradient="linear-gradient(135deg, #ec4899 0%, #db2777 100%)"
          />
        </Grid>
      </Grid>

      {/* Pending Requests Section */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e293b' }}>
          Live Pending Requests
        </Typography>
        <Chip label={`${pendingreq?.length || 0} Pending`} color="secondary" size="small" sx={{ fontWeight: 700 }} />
      </Stack>

      <TableContainer 
        component={Paper} 
        elevation={0} 
        sx={{ 
          borderRadius: '24px', 
          border: '1px solid #e2e8f0', 
          overflow: 'hidden'
        }}
      >
        {pendingreq?.length > 0 ? (
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell>Product Content</StyledTableCell>
                <StyledTableCell>Submission Date</StyledTableCell>
                <StyledTableCell>Total Estimates</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pendingreq.map((reservation) => {
                const totalAmount = reservation.products.reduce((total, product) => total + product.price, 0);
                return (
                  <StyledTableRow key={reservation._id}>
                    <StyledTableCell>
                      <Box
                        sx={{
                          display: 'flex',
                          overflowX: 'auto',
                          gap: 1.5,
                          p: 1,
                          '::-webkit-scrollbar': { height: '4px' },
                          '::-webkit-scrollbar-thumb': { bgcolor: '#e2e8f0', borderRadius: '4px' }
                        }}
                      >
                        {reservation?.products.length === 0 ? (
                          <Typography variant="body2" sx={{ color: '#94a3b8' }}>No menus selected</Typography>
                        ) : (
                          <>
                            {reservation?.products?.slice(0, 3)?.map((product, index) => (
                              <Box
                                key={index}
                                sx={{
                                  flex: '0 0 auto',
                                  width: 140,
                                  p: 1.5,
                                  borderRadius: '16px',
                                  border: '1px solid #f1f5f9',
                                  bgcolor: '#f8fafc',
                                  textAlign: 'left',
                                }}
                              >
                                <Avatar
                                  src={`${imagePath}/${product?.image}`}
                                  variant="rounded"
                                  sx={{ width: 40, height: 40, mb: 1, borderRadius: '8px' }}
                                />
                                <Typography variant="caption" display="block" sx={{ fontWeight: 700, color: '#1e293b' }} noWrap>
                                  {product.name}
                                </Typography>
                                <Typography variant="caption" sx={{ color: '#6366f1', fontWeight: 600 }}>
                                  ₹{product.price}
                                </Typography>
                              </Box>
                            ))}
                            {reservation.products.length > 3 && (
                              <Box
                                sx={{
                                  flex: '0 0 auto',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  width: 60,
                                  borderRadius: '16px',
                                  bgcolor: '#1e293b',
                                  color: 'white',
                                }}
                              >
                                <Typography variant="caption" sx={{ fontWeight: 700 }}>
                                  +{reservation.products.length - 3}
                                </Typography>
                              </Box>
                            )}
                          </>
                        )}
                      </Box>
                    </StyledTableCell>
                    <StyledTableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {moment(reservation.createdAt).format('MMM Do, YYYY')}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                        {moment(reservation.createdAt).format('h:mm a')}
                      </Typography>
                    </StyledTableCell>
                    <StyledTableCell>
                      <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#10b981' }}>
                        ₹{totalAmount || 0}
                      </Typography>
                    </StyledTableCell>
                  </StyledTableRow>
                );
              })}
            </TableBody>
          </Table>
        ) : (
          <Box sx={{ p: 10, textAlign: 'center' }}>
            <PendingActionsRoundedIcon sx={{ fontSize: 60, color: '#e2e8f0', mb: 2 }} />
            <Typography sx={{ color: '#94a3b8', fontWeight: 500 }}>
              No pending requests found at the moment.
            </Typography>
          </Box>
        )}
      </TableContainer>
    </Box>
  );
}
