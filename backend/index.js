require('dotenv').config();
const express = require('express');
const dbConnection= require('./db');
const cors = require('cors');

const app = express();

app.use(express.json());    

app.use(cors());

dbConnection();
const PORT = 8000;

app.use('/api/admin',require('./Routes/adminRoutes'));
app.use('/api/user',require('./Routes/userRoutes'));
app.use('/api/delivery',require('./Routes/User/deliveryRoutes'));
app.use("/api/image/",express.static("./Upload"))

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
