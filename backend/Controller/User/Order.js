const Order = require('../../Modal/Order');
const Product = require('../../Modal/Product');
const Cart = require('../../Modal/Cart'); // Import Cart model

const addOrder = async (req, res) => {
    try {
        const { user, products, status, name, address, phone, email, city, postalCode, totalamount, method } = req.body;
        // Check if each product exists and validate product details
        for (let data of products) {
            const productExists = await Product.findById(data?.productId);
            if (!productExists) {
                return res.status(400).send({ status: false, message: `Product with ID ${data.productId} not found` });
            }
        }
        
        // Create a new order
        const order = new Order({
            user,
            products, // Use products array with detailed information
            status,
            name,
            address,
            phone,
            email,
            city,
            postalCode,
            totalamount,
            method
        });
        // Save the order to the database
        await order.save();
        await Cart.deleteMany({ user });
        res.status(201).send({ status: true, message: 'Order added successfully' });
    } catch (error) {
        console.error('Error adding order:', error.message);
        res.status(500).send({ status: false, message: 'Internal server error' });
    }
};

const getOrders = async (req, res) => {
    try {
        // Define payment methods
        const onlineOrdersMethod = "online";
        const cashOnDeliveryMethod = "cash on delivery";
        // Fetch all orders
        const orders = await Order.find()
            .populate('user')  // Populate user details
            .exec(); // Execute the query
        // Fetch online orders
        const onlineOrders = await Order.find({ method: onlineOrdersMethod })
            .populate('user')  // Populate user details
            .exec(); // Execute the query
        // Fetch offline orders
        const offlineOrders = await Order.find({ method: cashOnDeliveryMethod })
            .populate('user')  // Populate user details
            .exec(); // Execute the query
        // Send the response with all orders, online orders, and offline orders
        res.send({
            status: true,
            orders,
            online: onlineOrders,
            offline: offlineOrders
        });
    } catch (error) {
        console.error('Error fetching orders:', error.message);
        res.status(500).send({
            status: false,
            message: 'Internal server error occurred'
        });
    }
};

const getOrdersByUserId = async (req, res) => {
    try {
        const userId = req.user;
        // Define payment methods
        const onlineOrdersMethod = "online";
        const cashOnDeliveryMethod = "cash on delivery";

        // Fetch all orders for the specific user
        const orders = await Order.find({ user: userId })
            .populate('user')  // Populate user details
            .exec(); // Execute the query

        // Fetch online orders for the specific user
        const onlineOrders = await Order.find({ user: userId, method: onlineOrdersMethod })
            .populate('user')  // Populate user details
            .exec(); // Execute the query

        // Fetch offline orders for the specific user
        const offlineOrders = await Order.find({ user: userId, method: cashOnDeliveryMethod })
            .populate('user')  // Populate user details
            .exec(); // Execute the query

        // Send the response with all orders, online orders, and offline orders for the specific user
        res.send({
            status: true,
            orders,
            online: onlineOrders,
            offline: offlineOrders
        });
    } catch (error) {
        console.error('Error fetching orders:', error.message);
        res.status(500).send({
            status: false,
            message: 'Internal server error occurred'
        });
    }
};

// Update an order
const updateOrder = async (req, res) => {
    try {
        const { user, product, cart, status, message } = req.body; // Note: Correct spelling of 'feedback'
        const updateData = {};
        if (user) updateData.user = user;
        if (product) updateData.product = product;
        if (cart) updateData.cart = cart; // Update cart instead of category
        if (status) updateData.status = status;
        if (message) updateData.feedback = message; // Correct spelling
        let order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).send({ status: false, message: 'Order not found' });
        }
        order = await Order.findByIdAndUpdate(req.params.id, { $set: updateData }, { new: true });
        res.send({ status: true, order });
    } catch (error) {
        console.error('Error updating order:', error.message);
        res.status(500).send({ status: false, message: 'Internal server error occurred' });
    }
};

// Delete an order
const deleteOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).send({ status: false, message: 'Order not found' });
        }
        await Order.findByIdAndDelete(req.params.id);
        res.send({ status: true, message: 'Order deleted successfully' });
    } catch (error) {
        console.error('Error deleting order:', error.message);
        res.status(500).send({ status: false, message: 'Internal server error occurred' });
    }
};

module.exports = {
    addOrder,
    getOrders,
    updateOrder,
    deleteOrder,
    getOrdersByUserId
};