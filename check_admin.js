const mongoose = require('mongoose');
const AdminSchema = require('./backend/Modal/adminLogin');
const URI = 'mongodb://127.0.0.1:27017/DiningDynamics';

async function checkAdmin() {
    try {
        await mongoose.connect(URI);
        const count = await AdminSchema.countDocuments();
        console.log(`Number of admin users: ${count}`);
        if (count > 0) {
            const admins = await AdminSchema.find();
            admins.forEach(admin => {
                console.log(`Admin found: ${admin.email}`);
            });
        }
    } catch (err) {
        console.error('Error connecting to MongoDB:', err.message);
    } finally {
        await mongoose.disconnect();
    }
}

checkAdmin();
