const Request = require('../../Modal/Request');
const { sendEmail } = require('../../Utils/emailService');

const getAvailableOrders = async (req, res) => {
    try {
        // Orders that are preparing or ready for pickup and not yet assigned to anyone
        const orders = await Request.find({ 
            status: { $in: ['preparing', 'ready'] }, 
            deliveryStatus: 'not_assigned' 
        })
            .populate('user')
            .sort({ createdAt: -1 });
        res.status(200).send({ success: true, orders });
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
};

const getMyOrders = async (req, res) => {
    try {
        const userId = req.user; // From Auth Middleware
        const orders = await Request.find({ deliveryBy: userId })
            .populate('user')
            .sort({ updatedAt: -1 });
        res.status(200).send({ success: true, orders });
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
};

const acceptOrder = async (req, res) => {
    try {
        const { orderId } = req.body;
        const userId = req.user;

        const order = await Request.findById(orderId);
        if (!order) return res.status(404).send({ success: false, message: 'Order not found' });
        if (order.deliveryStatus !== 'not_assigned') return res.status(400).send({ success: false, message: 'Order already taken' });

        order.deliveryBy = userId;
        order.deliveryStatus = 'accepted';
        order.status = 'out_for_delivery';
        await order.save();

        res.status(200).send({ success: true, message: 'Order picked up!', order });
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
};

const completeDelivery = async (req, res) => {
    try {
        const { orderId } = req.body;
        const order = await Request.findById(orderId).populate('user');
        
        if (!order) return res.status(404).send({ success: false, message: 'Order not found' });

        order.status = 'delivered';
        order.deliveryStatus = 'delivered';
        await order.save();

        // Send Email
        const userEmail = order.email || order.user?.email;
        const userName = order.name || order.user?.name || 'Valued Customer';
        
        if (userEmail) {
            const subject = "Your Order has been Delivered! 🍕";
            // We'll reuse the email service with a custom flag or message
            sendEmail(userEmail, subject, userName, true, "Your delicious meal has been delivered. Enjoy your food! We'd love to hear your feedback.").catch(err => {
                console.error('Delivery Email failed:', err.message);
            });
        }

        res.status(200).send({ success: true, message: 'Delivery completed!', order });
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
};

module.exports = {
    getAvailableOrders,
    getMyOrders,
    acceptOrder,
    completeDelivery
};
