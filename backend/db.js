const mongoose = require('mongoose')
const URI= 'mongodb://127.0.0.1:27017/DiningDynamics'

const mongoConnect = async () => {
    try {
        await mongoose.connect(URI);
        console.log('✅ MongoDB Connected Successfully to:', URI);
    } catch (err) {
        console.error('❌ MongoDB Connection Error:', err.message);
        // Important: If we can't connect, future database operations will hang or fail
    }
}


module.exports=mongoConnect;