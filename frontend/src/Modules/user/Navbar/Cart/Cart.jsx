import React, { useContext, useState } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Box,
  Typography,
  Divider,
  Button,
  CardMedia
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import CheckoutModal from './Checkout';
import { AuthContext } from '../../../GlobalContext';
import axios from 'axios';

const CartDrawer = ({ }) => {
  const { setCheckoutModalOpen, drawerOpen, handleDrawerClose, carts,setCartCount, imagePath,host,setProceedDetail } = useContext(AuthContext);
  const handleCheckout = async () => {
    // Prepare proceedDetail from carts
    const items = carts?.map(item => ({
      productId: item.product._id,
      name: item.product.name,
      price: item.product.price,
      image: item.product.image,
      quantity: item.quantity,
      total: item.product.price * item.quantity
    }));
    
    const totalAmount = calculateSubtotal();
    setProceedDetail({ items, totalAmount });
    await setCheckoutModalOpen(true);
  };


  const handleQuantityChange = async (item, qty, type) => {
    setCartCount((prev)=>prev+1)
    let newQuantity = 0;
    if (type === 'plus') {
      newQuantity = qty + 1;
    } else{
      newQuantity = qty - 1;
    }
      try {
        let CartId=item?._id;
        const response = await axios?.put(`${host}/api/user/updatecart/${CartId}`, {quantity: newQuantity});
      } catch (error) {
        console.error('Error updating cart quantity:', error);
      }
  };

  const calculateSubtotal = () => {
    return carts?.reduce((acc, item) => acc + item?.product?.price * item?.quantity, 0)?.toFixed(2);
  };

  return (
    <Drawer
      anchor="right"
      open={drawerOpen}
      sx={{ zIndex: 99999 }}
    >
      <Box
        sx={{
          width: 350,
          padding: 2,
          overflow: 'auto',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
        role="presentation"
      >
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Cart</Typography>
            <IconButton onClick={handleDrawerClose}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Divider />
          <List>
            {carts?.length === 0 ||carts==null? (
              <ListItem>
                <ListItemText primary="Your cart is empty" />
              </ListItem>
            ) : (
              carts?.map((item, index) => (
                <ListItem key={index} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    <CardMedia
                      component="img"
                      image={`${imagePath}/${item?.product?.image}`}
                      alt={item?.product?.image}
                      sx={{ width: 80, height: 80, objectFit: 'cover', mr: 2 }}
                    />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body1">{item?.product.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        ${item?.product?.price.toFixed(2)}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                        <IconButton onClick={() => handleQuantityChange(item, item?.quantity, 'minus')}>
                          <RemoveIcon />
                        </IconButton>
                        <Typography variant="body1" sx={{ mx: 2 }}>
                          {item?.quantity}
                        </Typography>
                        <IconButton onClick={() => handleQuantityChange(item, item?.quantity, 'plus')}>
                          <AddIcon />
                        </IconButton>
                      </Box>
                    </Box>
                    <Typography variant="body1" sx={{ textAlign: 'right', flex: 1 }}>
                      ${(item?.product?.price * item?.quantity).toFixed(2)}
                    </Typography>
                  </Box>
                </ListItem>
              ))
            )}
          </List>
          {carts?.length > 0 && (
            <>
              <Divider sx={{ mt: 2 }} />
              <Box sx={{ mt: 2, textAlign: 'right', backgroundColor: '#ffdfcc', p: 2 }}>
                <Typography variant="h6">Subtotal: ${calculateSubtotal()}</Typography>
                <Typography variant="h6">Total: ${calculateSubtotal()}</Typography>
              </Box>
            </>
          )}
        </Box>
        {carts?.length > 0 && (
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Button
              variant="contained"
              color="primary"
              sx={{ width: '80%' }}
              onClick={handleCheckout}
            >
              Proceed to Checkout
            </Button>
          </Box>
        )}
      </Box>
      <CheckoutModal  />
    </Drawer>
  );
};

export default CartDrawer;
