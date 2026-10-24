const Request = require('../../Modal/Request');
const Product = require('../../Modal/Product');
const Cart = require('../../Modal/Cart'); 
const { sendEmail } = require('../../Utils/emailService');

const addRequest = async (req, res) => {
    try {
        const { products, name, address, phone, email, city, postalCode, totalamount, method, formData, transactionId } = req.body;
        const user = req.user || req.body.user; // Prefer authenticated user from middleware
        
        // Flatten formData if it was sent as a sub-object from the frontend
        const finalName = name || formData?.name;
        const finalAddress = address || formData?.address;
        const finalPhone = phone || formData?.phone;
        const finalEmail = email || formData?.email;
        const finalCity = city || formData?.city;
        const finalPostalCode = postalCode || formData?.postalCode;

        // Check if each product exists and validate product details
        for (let data of products) {
            const productExists = await Product.findById(data.productId);
            if (!productExists) {
                return res.status(400).send({ success: false, message: `Product with ID ${data.productId} not found` });
            }
        }

        // Create a new Request
        const request = new Request({
            user,
            products,
            name: finalName,
            address: finalAddress,
            phone: finalPhone,
            email: finalEmail,
            city: finalCity,
            postalCode: finalPostalCode,
            totalamount,
            method,
            transactionId
        });

        // Save the request to the database
        await request.save();
        await Cart.deleteMany({ user });

        // Send order confirmation email to customer
        if (finalEmail) {
            try {
                await sendEmail(
                    finalEmail,
                    'Order Placed Successfully - Dining Dynamics',
                    finalName,
                    true,
                    `Your order of ₹${totalamount} has been received! We're preparing it now.`
                );
            } catch (emailErr) {
                console.error('[Email] Failed to send order confirmation:', emailErr.message);
            }
        }

        // Send order notification email to admin
        if (process.env.EMAIL_USER) {
            try {
                await sendEmail(
                    process.env.EMAIL_USER,
                    'New Order Received - Dining Dynamics',
                    'Admin',
                    true,
                    `A new order of ₹${totalamount} has been received from ${finalName} (Transaction ID: ${transactionId || 'N/A'})! Please check the admin dashboard.`
                );
            } catch (emailErr) {
                console.error('[Email] Failed to send order notification to admin:', emailErr.message);
            }
        }

        res.status(201).send({ success: true, message: 'Your order request has been received!', orderId: request._id });

    } catch (error) {
        console.error('Error adding request:', error.message);
        res.status(500).send({ success: false, message: "Something went wrong while placing your order!" });
    }
};


const getRequests = async (req, res) => {
    try {
        // Define status categories
        const reqsPending = 'pending';
        const reqsRejected = 'rejected';
        const reqsAccepted = 'accepted';
        
        // Fetch all requests with populated fields
        const allreq = await Request.find()
            .populate('user')          // Populate the user field
            .populate('table')         // Populate the table field
            .exec();
        
        // Fetch requests for each status category with populated fields
        const pendingreq = await Request.find({ status: reqsPending })
            .populate('user')
            .populate('table')
            .exec();
        
        const rejectedreq = await Request.find({ status: reqsRejected })
            .populate('user')
            .populate('table')
            .exec();
        
        const acceptedreq = await Request.find({ status: reqsAccepted })
            .populate('user')
            .populate('table')
            .exec();
        // Send response with all requests and categorized requests
        res.status(200).send({
            status: true,
            allreq,
            pendingreq,
            rejectedreq,
            acceptedreq,
        });
    } catch (error) {
        console.error('Error fetching requests:', error.message);
        res.status(500).send({ status: false, message: 'Something went wrong!' });
    }
};

const getRequestsByUserId = async (req, res) => {
    try {
        const userId = req.user;
        // Define status categories
        const reqsPending = 'pending';
        const reqsRejected = 'rejected';
        const reqsAccepted = 'accepted';

        // Fetch all requests for the specific user with populated fields
        const allreq = await Request.find({ user: userId })
            .populate('user')
            .populate('table')
            .populate('deliveryBy')
            .exec();

        // Fetch requests for each status category for the specific user with populated fields
        const pendingreq = await Request.find({ user: userId, status: reqsPending })
            .populate('user')
            .populate('table')
            .populate('deliveryBy')
            .exec();

        const rejectedreq = await Request.find({ user: userId, status: reqsRejected })
            .populate('user')
            .populate('table')
            .populate('deliveryBy')
            .exec();

        const acceptedreq = await Request.find({ user: userId, status: reqsAccepted })
            .populate('user')
            .populate('table')
            .populate('deliveryBy')
            .exec();

        // Send response with all requests and categorized requests for the specific user
        res.status(200).send({
            status: true,
            allreq,
            pendingreq,
            rejectedreq,
            acceptedreq,
        });
    } catch (error) {
        console.error('Error fetching requests:', error.message);
        res.status(500).send({ status: false, message: 'Something went wrong!' });
    }
};


const updateRequest = async (req, res) => {
    try {
        let requestId = req.params.id;
        const { status, message,transactionId } = req.body;
        console.log(req.body, 'req.body;');
        
        // Validate the status
        const validStatuses = ['pending', 'rejected', 'accepted', 'preparing', 'ready', 'out_for_delivery', 'delivered'];
        if (status && !validStatuses.includes(status)) {
            return res.send({ status: false, message: 'Invalid status' });
        }

        // Prepare update object
        const updateFields = {};
        if (status) updateFields.status = status;
        if (message) updateFields.feedback = message;
        if (transactionId) updateFields.transactionId = transactionId;

        // Find the request by ID and update its status and/or message
        const updatedRequest = await Request.findByIdAndUpdate(
            requestId,
            updateFields,
            { new: true } // Return the updated document
        ).populate('user'); 

        if (!updatedRequest) {
            return res.send({ status: false, message: 'Request not found' });
        }

        // If the status is updated to 'accepted' or 'rejected', send an Email notification
        if (status === 'accepted' || status === 'rejected') {
            const userEmail = updatedRequest.email || updatedRequest.user?.email;
            const userName = updatedRequest.name || updatedRequest.user?.name || 'Valued Customer';
            const isAccepted = status === 'accepted';
            const subject = isAccepted 
                ? 'Your Dining Dynamics Order is Confirmed!' 
                : 'Update regarding your Dining Dynamics Order';
            
            if (userEmail) {
                // Pass the admin's message (feedback) to the email service
                sendEmail(userEmail, subject, userName, isAccepted, message).catch(err => {
                    console.error('Background Email sending failed:', err.message);
                });
            } else {
                console.warn('[Email Notification] Skipping email: No user email found for request.');
            }
        }

        res.send({ status: true, message: 'Request updated successfully', updatedRequest });

    } catch (error) {
        console.error('Error updating request status:', error.message);
        res.status(500).send({ status: false, message: 'Internal server error' });
    }
};


const getSingleRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const request = await Request.findById(id)
            .populate('user')
            .populate('deliveryBy')
            .exec();
        if (!request) {
            return res.status(404).send({ success: false, message: 'Order not found' });
        }
        res.send({ success: true, request });
    } catch (error) {
        console.error('Error fetching single request:', error.message);
        res.status(500).send({ success: false, message: 'Internal server error' });
    }
};



const assignDeliveryBoy = async (req, res) => {
    try {
        const { requestId, deliveryBoyId } = req.body;
        const updatedRequest = await Request.findByIdAndUpdate(
            requestId,
            { 
                deliveryBy: deliveryBoyId,
                deliveryStatus: 'assigned'
            },
            { new: true }
        ).populate('deliveryBy');

        if (!updatedRequest) {
            return res.status(404).send({ success: false, message: 'Request not found' });
        }

        res.status(200).send({ success: true, message: 'Delivery boy assigned successfully', updatedRequest });
    } catch (error) {
        console.error('Error assigning delivery boy:', error.message);
        res.status(500).send({ success: false, message: 'Internal server error' });
    }
};

const getDeliveryOrders = async (req, res) => {
    try {
        const deliveryBoyId = req.user; // Set by auth middleware for delivery personnel
        const assignedOrders = await Request.find({ deliveryBy: deliveryBoyId })
            .populate('user')
            .populate('table')
            .sort({ createdAt: -1 });

        res.status(200).send({ success: true, assignedOrders });
    } catch (error) {
        console.error('Error fetching delivery orders:', error.message);
        res.status(500).send({ success: false, message: 'Internal server error' });
    }
};

module.exports = {
    addRequest,
    getRequests,
    updateRequest,
    getRequestsByUserId,
    getSingleRequest,
    assignDeliveryBoy,
    getDeliveryOrders
};
