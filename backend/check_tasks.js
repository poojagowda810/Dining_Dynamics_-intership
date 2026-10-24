const mongoose = require('mongoose');
const Request = require('./Modal/Request');
const Delivery = require('./Modal/deliveryModel');

mongoose.connect('mongodb://127.0.0.1:27017/DiningDynamics', { useNewUrlParser: true, useUnifiedTopology: true })
.then(async () => {
    const requests = await Request.find({ status: 'accepted' }).populate('deliveryBy');
    console.log("\n--- Accepted Requests ---");
    requests.forEach(req => {
        console.log(`Order ID: ${req._id}, Status: ${req.status}, Assigned To: ${req.deliveryBy ? req.deliveryBy.name + " (" + req.deliveryBy.email + ")" : 'None'}`);
    });

    const deliveries = await Delivery.find();
    console.log("\n--- All Deliveries ---");
    deliveries.forEach(d => {
        console.log(`Name: ${d.name}, ID: ${d._id}, Email: ${d.email}`);
    });

    process.exit(0);
})
.catch(err => {
    console.error(err);
    process.exit(1);
});
