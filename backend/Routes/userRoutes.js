const express=require('express');
const upload = require('../Middleware/upload'); // Adjust the path as necessary
const { UserRegister, UserLogin, GetOneUser, GetUser } = require('../Controller/User/RegisterLogin');
const { createCart, getAllCarts, updateCart, deleteCart, getCartById } = require('../Controller/User/Cart');
const router=express.Router();
const { fetchUser, fetchDelivery } = require('../Middleware/middleware'); // Adjust the path as necessary
const { addOrder, getOrders, updateOrder, deleteOrder, getOrdersByUserId } = require('../Controller/User/Order');
const { addRequest, getRequests, getRequestsByUserId, updateRequest, getSingleRequest, getDeliveryOrders } = require('../Controller/User/Request');

// Delivery
router.get('/getDeliveryOrders', fetchDelivery, getDeliveryOrders);
router.put('/deliveryUpdateRequest/:id', fetchDelivery, updateRequest);

//user register/Login
router.get('/get-logged-user', fetchUser, GetOneUser); // For GlobalContext.jsx compatibility
router.post('/user-register', UserRegister);
router.post('/user-login', UserLogin);
router.get('/get-single-user', fetchUser, GetOneUser);
router.get('/get-user', GetUser);

// Cart
router.post('/addtocart', fetchUser, createCart); // Protected
router.get('/getcarts', getAllCarts);
router.get('/getCartById', fetchUser, getCartById);
router.delete('/deletecart/:id', fetchUser, deleteCart);
router.put('/updatecart/:id', fetchUser, updateCart);

// Order
router.post('/insertorder', fetchUser, addOrder); // Protected
router.get('/getorders', getOrders);
router.get('/getordersById', fetchUser, getOrdersByUserId);
router.delete('/deleteorder/:id', fetchUser, deleteOrder);
router.put('/updateorder/:id', fetchUser, updateOrder);

// Request
router.post('/addRequest', fetchUser, addRequest); // Protected
router.get('/getRequests', getRequests);
router.get('/getRequestsByUserId', fetchUser, getRequestsByUserId);
router.put('/updaterequest/:id', fetchUser, updateRequest);
router.get('/getSingleRequest/:id', fetchUser, getSingleRequest);


module.exports=router;
