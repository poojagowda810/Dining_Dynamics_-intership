const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Delivery = require('./Modal/deliveryModel');

mongoose.connect('mongodb://127.0.0.1:27017/DiningDynamics', { useNewUrlParser: true, useUnifiedTopology: true })
.then(async () => {
    const salt = await bcrypt.genSalt(10);
    const secpass = await bcrypt.hash('123456', salt);

    const result = await Delivery.updateMany(
        {}, 
        { password: secpass }
    );
    
    console.log("Updated deliveries count:", result.modifiedCount);
    console.log("All Delivery passwords reset successfully to 123456");

    process.exit(0);
})
.catch(err => {
    console.error(err);
    process.exit(1);
});
