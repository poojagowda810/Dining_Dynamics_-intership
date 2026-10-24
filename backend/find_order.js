const mongoose = require('mongoose');
const Request = require('./Modal/Request');

mongoose.connect('mongodb://127.0.0.1:27017/DiningDynamics', { useNewUrlParser: true, useUnifiedTopology: true })
.then(async () => {
    const all = await Request.find();
    console.log("All Requests with last 6 chars of ID:");
    all.forEach(r => {
        console.log(`ID: ${r._id}, Display: #${r._id.toString().slice(-6).toUpperCase()}, Status: ${r.status}, Email: ${r.email}, DeliveryBy: ${r.deliveryBy}`);
    });
    process.exit(0);
})
.catch(err => {
    console.error(err);
    process.exit(1);
});
