const User = require('../../Modal/userModel');
const Delivery = require('../../Modal/deliveryModel');
const { sendCredentialEmail } = require('../../Utils/emailService');
const bcrypt = require('bcrypt');


const updateUserRole = async (req, res) => {
    try {
        const { userId, role } = req.body;
        
        // Validate role
        const validRoles = ['user', 'admin', 'delivery'];
        if (!validRoles.includes(role)) {
            return res.status(400).send({ success: false, message: 'Invalid role' });
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { role },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).send({ success: false, message: 'User not found' });
        }

        res.status(200).send({ 
            success: true, 
            message: `User role updated to ${role} successfully`,
            user: updatedUser 
        });
    } catch (error) {
        console.error('Error updating user role:', error.message);
        res.status(500).send({ success: false, message: 'Internal server error' });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().sort({ createdAt: -1 });
        res.status(200).send({ success: true, users });
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
};

const addDeliveryUser = async (req, res) => {
    try {
        const { name, email, phone, password, address } = req.body;

        // Check if user already exists in Delivery collection
        const existingDelivery = await Delivery.findOne({ email });
        if (existingDelivery) {
            return res.status(400).send({ success: false, message: 'Email already exists in delivery collection' });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new delivery boy
        const newDelivery = new Delivery({
            name,
            email,
            phone,
            password: hashedPassword,
            address,
            status: 'active'
        });

        await newDelivery.save();
        
        // Send credential email asynchronously
        try {
            await sendCredentialEmail(email, name, email, password);
        } catch (emailError) {
            console.error('Failed to send credential email:', emailError.message);
            // We don't fail the registration if email fails, but we logged it
        }

        res.status(201).send({ 
            success: true, 
            message: 'Delivery Boy created successfully',
            delivery: {
                id: newDelivery._id,
                name: newDelivery.name,
                email: newDelivery.email
            }
        });
    } catch (error) {
        console.error('Error creating delivery boy:', error.message);
        res.status(500).send({ success: false, message: 'Internal server error' });
    }
};

const getDeliveryUsers = async (req, res) => {
    try {
        const deliveries = await Delivery.find().sort({ createdAt: -1 });
        res.status(200).send({ success: true, deliveries });
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
};

module.exports = {
    updateUserRole,
    getAllUsers,
    addDeliveryUser,
    getDeliveryUsers
};
