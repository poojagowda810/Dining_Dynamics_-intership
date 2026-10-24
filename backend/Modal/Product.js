const mongoose = require('mongoose');
const { Schema } = mongoose;

const productSchema = new Schema({
  name: {
    type: String,
    required: true,
    maxlength: 50
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  description: {
    type: String,
    required: true,
    maxlength: 500 // Adjust the limit as needed
  },
  discount: {
    type: Number,
    default: 0,
    min: 0
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  image: {
    type: String, // URL or path to the image file
    required: false
  }
}, { timestamps: true });

const Product = mongoose.model('product', productSchema);

module.exports = Product;
