const mongoose = require('mongoose');
const Delivery = require('./Modal/deliveryModel');

mongoose.connect('mongodb://localhost:27017/diningdynamics', { useNewUrlParser: true, useUnifiedTopology: true })
.then(async () => {
    const deliveries = await Delivery.find();
    console.log("Deliveries found in DB:");
    console.log(deliveries);
    process.exit(0);
})
.catch(err => {
    console.error(err);
    process.exit(1);
});
