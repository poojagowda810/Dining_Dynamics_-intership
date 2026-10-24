const express = require('express');
const router = express.Router();
const { getAvailableOrders, getMyOrders, acceptOrder, completeDelivery } = require('../../Controller/User/Delivery');
const { fetchDelivery } = require('../../Middleware/middleware');

// All delivery routes are protected and require a delivery role
router.get('/available', fetchDelivery, getAvailableOrders);
router.get('/my-orders', fetchDelivery, getMyOrders);
router.post('/accept', fetchDelivery, acceptOrder);
router.post('/complete', fetchDelivery, completeDelivery);

module.exports = router;
