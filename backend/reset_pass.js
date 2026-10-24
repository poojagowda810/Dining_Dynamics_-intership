const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Delivery = require('./Modal/deliveryModel');

mongoose.connect('mongodb://127.0.0.1:27017/DiningDynamics', { useNewUrlParser: true, useUnifiedTopology: true })
.then(async () => {
    const salt = await bcrypt.genSalt(10);
    const secpass = await bcrypt.hash('123456', salt);

    const result = await Delivery.findOneAndUpdate(
        { email: 'johndea12@gmail.com' },
        { password: secpass },
        { new: true }
    );
    
    console.log("Updated delivery boy:", result.email);
    console.log("Password reset successfully to 123456");

    process.exit(0);
})
.catch(err => {
    console.error(err);
    process.exit(1);
});
