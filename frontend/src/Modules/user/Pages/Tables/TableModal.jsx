import React, { useState, useContext, useEffect } from 'react';
import { Box, Typography, Grid, TextField, Button, Avatar, Checkbox, FormControlLabel, Modal, Fade, Backdrop, IconButton, Divider } from '@mui/material';
import Swal from 'sweetalert2';
import { AuthContext } from '../../../GlobalContext';
import '../../../../App.css';
import CloseIcon from '@mui/icons-material/Close';
import toast, { Toaster } from 'react-hot-toast';
import FoodCard from '../Menus/FoodCard';
import axios from 'axios';
import moment from 'moment';

const MenuWithPayment = ({ open, onClose, reservation, }) => {
  const { products, imagePath, cartOpen, setCartOpen, host, user, selectedTable } = useContext(AuthContext);
  const [selectedProductItem, setSelectedProductItem] = useState(null);

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: 300, sm: 900 },
    bgcolor: 'background.paper',
    borderRadius: '30px',
    boxShadow: 1,
    p: 6,
  };

  const [selectedItems, setSelectedItems] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
  });
  const [errors, setErrors] = useState({});

  const handleSelectItem = (item) => {
    setSelectedItems((prevItems) => {
      const exists = prevItems?.find((i) => i._id === item._id);
      const updatedItems = exists
        ? prevItems.filter((i) => i._id !== item._id)
        : [...prevItems, item];
      return updatedItems;
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phone' && value.length > 10) return; // Restrict phone number length
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.address) newErrors.address = 'Address is required';
    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'Phone number must be exactly 10 digits';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const MakeRequest = () => {
    if (!validate()) return; // Use validate function for validation
    const selectedProduct = selectedItems?.map(item => ({
      productId: item._id,
      name: item.name,
      price: item.price,
      image: item.image,
    }));
    const Data = {
      products: selectedProduct,
      user: user?._id,
      formData: formData,
      totalamount: calculateTotalAmount(),
      reservation: reservation,
      table: selectedTable?._id
    };
    axios.post(`${host}/api/user/addRequest`, Data)
      .then((res) => {
        if (res.data.status) {
          onClose()
          toast.success(res.data.message);
        }
      })
      .catch((err) => {
        console.log(err);
      });
    // onClose();
  };

  const calculateTotalAmount = () => {
    return selectedItems?.reduce((total, item) => total + item.price, 0);
  };

  const ProductClick = (productItem) => {
    setCartOpen(true);
    setSelectedProductItem(productItem);
  };

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 1000,
        }}
        sx={{ zIndex: 9999 }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <Typography variant="h4" gutterBottom>
              Review Your Order
            </Typography>
            <IconButton onClick={onClose} sx={{ position: 'absolute', top: 8, right: 8 }}>
              <CloseIcon />
            </IconButton>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="h6" gutterBottom>
                  Menu List
                </Typography>
                
                <Typography variant="h3" gutterBottom>
                  Reservation for {moment(reservation?.date).format('dddd, MMMM D, YYYY')} at {moment(reservation?.time, 'HH:mm').format('h:mm A')}
                </Typography>

                <Divider />
                <Box sx={{ height: '50vh', overflowY: 'scroll', p: 2 }}>
                  {products?.map((item) => (
                    <Box
                      key={item.id}
                      sx={{
                        border: selectedItems?.some((i) => i._id === item._id) ? '2px solid green' : '1px solid grey',
                        borderRadius: '10px',
                        p: 2,
                        mb: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <Box
                        onClick={() => ProductClick(item)}
                        sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar src={`${imagePath}/${item.image}`} alt={item.name} sx={{ mr: 2 }} />
                        <Box>
                          <Typography variant="body1">{item.name}</Typography>
                          {item.discount && (
                            <Typography variant="body2" color="textSecondary">
                              Discount: ₹{item.discount}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        <Typography variant="h5" color="green">
                          ₹{item.price}
                        </Typography>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={selectedItems?.some((i) => i._id === item._id)}
                              onChange={() => handleSelectItem(item)}
                              color="primary"
                            />
                          }
                          labelPlacement="end"
                        />
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="h6" component="h2" sx={{ mt: 3 }}>
                  Your Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      error={!!errors.name}
                      helperText={errors.name}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      error={!!errors.phone}
                      helperText={errors.phone}
                      inputProps={{ maxLength: 10 }} // Add maxLength for phone number
                      type="tel"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      error={!!errors.address}
                      helperText={errors.address}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Amount to Pay"
                      name="amount"
                      value={`₹${calculateTotalAmount()}`}
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sx={{ mt: 2 }}>
                    <Button variant="contained" fullWidth onClick={MakeRequest}>
                      Make a Request
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </Fade>
      </Modal>

      <FoodCard
        open={cartOpen}
        productItem={selectedProductItem}
        fromTable={true}
        handleClose={() => setCartOpen(false)}
      />

      <Toaster position="top-center" reverseOrder={false} />
    </>
  );
};

export default MenuWithPayment;
