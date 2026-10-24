import React, { useContext, useState } from 'react';
import { Box, Tabs, Tab, Typography, Button, Paper, List, ListItem, ListItemText, TextField, Divider } from '@mui/material';
import { AuthContext } from '../../../../GlobalContext';
import moment from 'moment';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { Person, Email, Phone, Home } from '@mui/icons-material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import Swal from 'sweetalert2';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import scanner from "../../../Images/Scanner.png";


// TabPanel Component
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          {children}
        </Box>
      )}
    </div>
  );
}

// ReservationItem Component
const ReservationItem = ({ reservation, imagePath, handleSubmitFeedback, host, isRejected, isAccepted, feedbacks, showFeedbackInput, currentReservationId, setShowFeedbackInput, setCurrentReservationId, handleFeedbackChange, navigate }) => {
  const totalAmount = reservation.products.reduce((total, product) => total + product.price, 0);

  const handleFeedbackButtonClick = () => {
    if (showFeedbackInput && currentReservationId === reservation._id) {
      setShowFeedbackInput(false);
      setCurrentReservationId(null);
    } else {
      setShowFeedbackInput(true);
      setCurrentReservationId(reservation._id);
    }
  };



  const handleDone = (transactionId) => {
    const Data = {
      transactionId // Include transactionId here
    };
    axios.put(`${host}/api/admin/updaterequest/${reservation?._id}`, Data)
      .then((res) => {
        if (res.data.status) {
          toast.success('Payment Successfully');
          // setreqCount((prev) => prev + 1)
          navigate('/menus')
          // setPackageCount((prev) => prev + 1)
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handlePayment = () => {
    Swal.fire({
      title: 'Scan the QR Code',
      html: `
            <div style="display: flex; justify-content: center; align-items: center;">
                <img src="${scanner}" alt="QR Code" style="width:50%; height:50%; margin:auto;">
            </div>
            <input type="text" id="transactionId" class="swal2-input" placeholder="Enter Transaction ID">
        `,
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonText: 'Proceed to QR Code',
      cancelButtonText: 'Cancel',
      preConfirm: () => {
        const transactionId = Swal.getPopup().querySelector('#transactionId').value;
        if (!transactionId) {
          Swal.showValidationMessage('Transaction ID is required');
          return false;
        } else if (transactionId.length < 6) {
          Swal.showValidationMessage('Transaction ID must be at least 6 characters long');
          return false;
        }
        return transactionId;
      }
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire('Payment Done', 'Your payment has been processed!', 'success');
        handleDone(result.value);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelled', 'Try Next time', 'info');
      }
    });
  };



  return (
    <Box key={reservation._id} sx={{ mb: 2 }}>
      <ListItem
        sx={{
          border: '1px solid #ddd',
          borderRadius: '14px',
          padding: '16px',
          backgroundColor: '#f9f9f9',
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column'
        }}
      >

        <Box sx={{ width: '100%', mb: 2, alignItems: 'center', p: 1 }}>

          <Typography variant="h5" sx={{}}>
            {reservation?.table?.name}
          </Typography>
          <Divider />
          <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 1, mt: 2 }}>
            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AccessTimeIcon fontSize="small" />
              Reservation Date: {moment(reservation?.createdAt).format('MMMM Do YYYY, h:mm:ss a')}
            </Typography>
          </Box>
        </Box>
        <Divider />

        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', mb: 2, alignItems: 'center' }}>
          <Typography variant="h3" sx={{ fontSize: '18px' }}>
            Ordered Menus
          </Typography>
        </Box>

        <Box
          sx={{
            width: '100%',
            padding: 2,
            display: 'flex',
            alignItems: 'center',
            overflowX: 'auto',
            '::-webkit-scrollbar': {
              height: '5px',
            },
            '::-webkit-scrollbar-thumb': {
              backgroundColor: 'rgba(0, 0, 0, 0.1)',
              borderRadius: '15px',
            },
            '::-webkit-scrollbar-track': {
              backgroundColor: '#f9f9f9',
            },
          }}
        >
          {reservation.products.map((product, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 2, flex: '0 0 auto', mr: 2 }}>
              <Box sx={{ mr: 2 }}>
                <img
                  src={`${imagePath}/${product.image}`}
                  alt={product.name}
                  style={{ width: 100, height: 100, borderRadius: '8px' }}
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <ListItemText
                  primary={product.name}
                  secondary={`Status: ${reservation.status} | Total: ${product?.price} Rupees`}
                />
              </Box>
            </Box>
          ))}
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'row', alignSelf: 'flex-end', m: 2 }}>
          <Typography sx={{ fontWeight: 500, }}>
            Total Amount: {totalAmount} Rupees
          </Typography>
        </Box>

        {reservation.status === "accepted" && (
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
            <Button
              sx={{ border: reservation.transactionId ? '1px solid green' : '1px solid pink' }}
              onClick={reservation?.transactionId ? () => { } : handlePayment}
            >
              {reservation?.transactionId ? 'Paid Successfully' : 'Pay Now'}
            </Button>
          </Box>
        )}

        {reservation.status === "accepted" && reservation?.transactionId && (
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
            <Button
              variant="contained"
              sx={{ mr: 1, backgroundColor: 'green', color: 'white' }}
              onClick={handleFeedbackButtonClick}
            >
              Feedback
            </Button>
          </Box>
        )}

      </ListItem>

      {showFeedbackInput && currentReservationId === reservation._id && (
        <Box sx={{ mt: 2, padding: '16px', border: '1px solid #ddd', borderRadius: '14px', backgroundColor: '#f9f9f9' }}>
          <TextField
            label="Your Feedback"
            variant="outlined"
            multiline
            rows={2}
            value={feedbacks[reservation._id] || ''}
            onChange={(e) => handleFeedbackChange(e, reservation._id)}
            fullWidth
          />
          <Button
            variant="contained"
            onClick={() => handleSubmitFeedback(reservation._id)}
            sx={{ mt: 2, borderRadius: '8px' }}
            fullWidth
          >
            Submit Feedback
          </Button>
        </Box>
      )}
    </Box>
  );
};

// Main Reservation Component
export default function Reservation() {
  const {
    userpendingreq,
    useracceptedreq,
    userrejreq
    , imagePath, host, user } = useContext(AuthContext);
  const [tabValue, setTabValue] = useState(0);

  let navigate = useNavigate()

  const [feedbacks, setFeedbacks] = useState({});
  const [showFeedbackInput, setShowFeedbackInput] = useState(false);
  const [currentReservationId, setCurrentReservationId] = useState(null);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleFeedbackChange = (event, reservationId) => {
    setFeedbacks({
      ...feedbacks,
      [reservationId]: event.target.value
    });
  };

  const handleSubmitFeedback = async (reservationId) => {
    const feedbackMessage = feedbacks[reservationId];
    if (!feedbackMessage) {
      toast.error('Feedback cannot be empty.');
      return;
    }
    const data = {
      message: feedbackMessage
    };
    console.log(currentReservationId, 'currentReservationId');

    await axios.put(`${host}/api/admin/updateRequest/${reservationId}`, data)
      .then((res) => {
        if (res.data.status) {
          toast.success(`Feedback sent successfully`);
          // setreqCount((prev) => prev + 1)
          // Update the state or refetch the reservations to reflect the change
          setShowFeedbackInput(false);
        } else {
          throw new Error(`Failed to  the reservation`);
        }
      })
      .catch((err) => {
        console.error('Error:', err.message);
        toast.error('An error occurred. Please try again.');
      });


  };

  return (
    <>
      <Box sx={{}}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="Reservation Tabs">
          <Tab label="Accepted" />
          <Tab label="Pending" />
          <Tab label="Rejected" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <Typography variant="h6">Accepted Reservations</Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Here are the reservations that have been accepted.
          </Typography>
          <Paper elevation={1} sx={{ padding: 2, mt: 2 }}>
            {useracceptedreq?.length > 0 ? (
              <List>
                {useracceptedreq?.map(reservation => (
                  <ReservationItem
                    key={reservation._id}
                    reservation={reservation}
                    imagePath={imagePath}
                    handleSubmitFeedback={handleSubmitFeedback}
                    feedbacks={feedbacks}
                    showFeedbackInput={showFeedbackInput}
                    currentReservationId={currentReservationId}
                    setShowFeedbackInput={setShowFeedbackInput}
                    setCurrentReservationId={setCurrentReservationId}
                    handleFeedbackChange={handleFeedbackChange}
                    isAccepted
                    navigate={navigate}
                    host={host}
                  />
                ))}
              </List>
            ) : (
              <Typography>No accepted reservations at the moment.</Typography>
            )}
          </Paper>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Typography variant="h6">Pending Reservations</Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            These are your pending reservations. Please wait for further updates.
          </Typography>
          <Paper elevation={1} sx={{ padding: 2, mt: 2 }}>
            {userpendingreq?.length > 0 ? (
              <List>
                {userpendingreq?.map(reservation => (
                  <ReservationItem
                    key={reservation._id}
                    reservation={reservation}
                    imagePath={imagePath}
                    handleSubmitFeedback={handleSubmitFeedback}
                    feedbacks={feedbacks}
                    showFeedbackInput={showFeedbackInput}
                    currentReservationId={currentReservationId}
                    setShowFeedbackInput={setShowFeedbackInput}
                    setCurrentReservationId={setCurrentReservationId}
                    handleFeedbackChange={handleFeedbackChange}
                    isPending
                  />
                ))}
              </List>
            ) : (
              <Typography>No pending reservations at the moment.</Typography>
            )}
          </Paper>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Typography variant="h6">Rejected Reservations</Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Unfortunately, these reservations have been rejected. You can review the details below.
          </Typography>
          <Paper elevation={1} sx={{ padding: 2, mt: 2 }}>
            {userrejreq?.length > 0 ? (
              <List>
                {userrejreq?.map(reservation => (
                  <ReservationItem
                    key={reservation._id}
                    reservation={reservation}
                    imagePath={imagePath}
                    handleSubmitFeedback={handleSubmitFeedback}
                    feedbacks={feedbacks}
                    showFeedbackInput={showFeedbackInput}
                    currentReservationId={currentReservationId}
                    setShowFeedbackInput={setShowFeedbackInput}
                    setCurrentReservationId={setCurrentReservationId}
                    handleFeedbackChange={handleFeedbackChange}
                    isRejected
                  />
                ))}
              </List>
            ) : (
              <Typography>No rejected reservations at the moment.</Typography>
            )}
          </Paper>
        </TabPanel>
      </Box>
      <Toaster position="top-center" reverseOrder={false} />
    </>
  );
}
