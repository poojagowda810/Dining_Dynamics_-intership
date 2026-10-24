const mongoose = require('mongoose');
const User = require('./Modal/userModel');
const Delivery = require('./Modal/deliveryModel');

mongoose.connect('mongodb://127.0.0.1:27017/DiningDynamics', { useNewUrlParser: true, useUnifiedTopology: true })
.then(async () => {
    const d = await Delivery.findOne({email: 'johndea12@gmail.com'});
    console.log("\n--- In Delivery DB ---");
    console.log(d);
    
    const u = await User.findOne({email: 'johndea12@gmail.com'});
    console.log("\n--- In User DB ---");
    console.log(u);
    
    const allUsers = await User.find({}, 'email role');
    console.log("\n--- All Users ---");
    console.log(allUsers);

    const allDeliveries = await Delivery.find({}, 'email');
    console.log("\n--- All Deliveries ---");
    console.log(allDeliveries);

    process.exit(0);
})
.catch(err => {
    console.error(err);
    process.exit(1);
});
