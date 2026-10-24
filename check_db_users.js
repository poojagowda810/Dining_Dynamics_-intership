const mongoose = require('mongoose');
const User = require('./backend/Modal/userModel');

const URI = 'mongodb://127.0.0.1:27017/DiningDynamics';

const checkUsers = async () => {
    try {
        await mongoose.connect(URI);
        console.log('Connected to MongoDB');
        
        const deliveryBoys = await User.find({ role: 'delivery' });
        console.log('Found', deliveryBoys.length, 'delivery boys:');
        deliveryBoys.forEach(boy => {
            console.log(`- ${boy.name} (${boy.email}) - Role: ${boy.role}`);
        });

        const allUsers = await User.find();
        console.log('\nTotal users in collection:', allUsers.length);
        
        mongoose.connection.close();
    } catch (err) {
        console.error(err);
    }
};

checkUsers();
