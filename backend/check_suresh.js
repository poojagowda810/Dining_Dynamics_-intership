const mongoose = require('mongoose');
const User = require('./Modal/userModel');
const Delivery = require('./Modal/deliveryModel');

mongoose.connect('mongodb://127.0.0.1:27017/DiningDynamics', { useNewUrlParser: true, useUnifiedTopology: true })
.then(async () => {
    const user = await User.findOne({email: 'suresh34@gmail.com'});
    console.log("\n--- In User DB (suresh34) ---");
    console.log(user);
    
    const d = await Delivery.findOne({email: 'suresh34@gmail.com'});
    console.log("\n--- In Delivery DB (suresh34) ---");
    console.log(d);
    
    process.exit(0);
})
.catch(err => {
    console.error(err);
    process.exit(1);
});
