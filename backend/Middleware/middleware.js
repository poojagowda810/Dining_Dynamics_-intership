const jwt = require('jsonwebtoken');
const userSchema = require('../Modal/userModel');
const deliverySchema = require('../Modal/deliveryModel');
const key = "Hello";

const fetchUser = async (req, res, next) => {
    const token = req.header('auth-token');
    if (!token) {
        return res.status(401).send({ success: false, message: 'Authentication token is missing' });
    }
    try {
        const data = jwt.verify(token, key);
        const userId = (typeof data === 'object' && data.id) ? data.id : data;
        
        const user = await userSchema.findById(userId);
        if (!user) {
            return res.status(401).send({ success: false, message: 'User not found' });
        }
        req.user = user.id;
        next();
    } catch (err) {
        return res.status(401).send({ success: false, message: 'Invalid token' });
    }
};

const AdminSchema = require('../Modal/adminLogin');

const fetchAdmin = async (req, res, next) => {
    const token = req.header('auth-token');
    if (!token) {
        return res.status(401).send({ success: false, message: 'Authentication token is missing' });
    }
    try {
        const data = jwt.verify(token, key);
        
        // Support both old string payloads and new object payloads
        const userId = (typeof data === 'object' && data.id) ? data.id : data;
        const explicitRole = typeof data === 'object' ? data.role : null;

        // 1. Check if they exist in the regular User collection AND have the 'admin' role
        const user = await userSchema.findById(userId);
        if (user && user.role === 'admin') {
            req.user = user.id;
            return next();
        }

        // 2. Check if they exist in the dedicated Admin collection
        const adminUser = await AdminSchema.findById(userId);
        if (adminUser || explicitRole === 'admin') {
            req.user = userId;
            return next();
        }

        return res.status(403).send({ success: false, message: 'Admin access required' });
    } catch (err) {
        return res.status(401).send({ success: false, message: 'Invalid token' });
    }
};

const fetchDelivery = async (req, res, next) => {
    const token = req.header('auth-token');
    if (!token) {
        return res.status(401).send({ success: false, message: 'Authentication token is missing' });
    }
    try {
        const data = jwt.verify(token, key);
        const userId = (typeof data === 'object' && data.id) ? data.id : data;

        const user = await deliverySchema.findById(userId);
        if (!user) {
            return res.status(403).send({ success: false, message: 'Delivery boy not found or access denied' });
        }
        req.user = user.id;
        next();
    } catch (err) {
        return res.status(401).send({ success: false, message: 'Invalid token' });
    }
};

module.exports = { fetchUser, fetchAdmin, fetchDelivery };