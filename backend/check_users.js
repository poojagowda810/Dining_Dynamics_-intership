const mongoose = require('mongoose');
const User = require('./Modal/userModel');

mongoose.connect('mongodb://localhost:27017/diningdynamics', { useNewUrlParser: true, useUnifiedTopology: true })
.then(async () => {
    const users = await User.find({role: 'delivery'});
    console.log("Delivery-role users found in User DB:");
    console.log(users);
    process.exit(0);
})
.catch(err => {
    console.error(err);
    process.exit(1);
});
