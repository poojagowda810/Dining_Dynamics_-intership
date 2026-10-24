const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define a schema for the product details that will be embedded in the order
const ProductDetailSchema = new Schema({
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'product',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  image: {
    type: String,
    required: true
  },
});

// Define the Request schema with an array of ProductDetailSchema
const RequestSchema = new Schema({

  user: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  products: [ProductDetailSchema], // Embed the product details directly
  name: {
    type: String,
    // Uncomment if name is required
    // required: true 
  },
  address: {
    type: String,
    // Uncomment if address is required
    // required: true 
  },
  phone: {
    type: String,
    // Uncomment if phone is required
    // required: true 
  },
  totalamount: {
    type: Number,
  },
  email: {
    type: String,
  },
  city: {
    type: String,
  },
  postalCode: {
    type: String,
  },
  method: {
    type: String,
  },
  table: {
    type: Schema.Types.ObjectId,
    ref: 'table',
  },
  feedback: {
    type: String,
  },
  transactionId: {
    type: String,
},
  reservation: {
    date: {
      type: String, // ISO date string
    },
    time: {
      type: String, // Time in HH:mm format
    }
  },
  
  status: {
    type: String,
    default: "pending"
  },
  deliveryBy: {
    type: Schema.Types.ObjectId,
    ref: 'delivery',
  },
  deliveryStatus: {
    type: String,
    default: "not_assigned" // not_assigned, accepted, delivered
  }
}, { timestamps: true });

const Request = mongoose.model('request', RequestSchema);

module.exports = Request;
