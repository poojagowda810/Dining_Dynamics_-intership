const mongoose = require('mongoose');
const Request = require('./Modal/Request');

mongoose.connect('mongodb://127.0.0.1:27017/DiningDynamics', { useNewUrlParser: true, useUnifiedTopology: true })
.then(async () => {
    const orders = await Request.find({ deliveryBy: { $exists: true } });
    console.log("Orders with assigned delivery boy IDs:");
    orders.forEach(o => {
        console.log(`Order: #${o._id.toString().slice(-6).toUpperCase()}, deliveryBy: ${o.deliveryBy} (typeof: ${typeof o.deliveryBy})`);
    });
    process.exit(0);
})
.catch(err => {
    console.error(err);
    process.exit(1);
});
