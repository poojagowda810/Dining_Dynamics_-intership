const Cart = require('../../Modal/Cart'); // Adjust the path as needed
// Create or update a cart item
const createCart = async (req, res) => {
    try {
      const { user, product } = req.body;
      // Validate input
      if (!user || !product) {
        return res.status(400).json({ success: false, message: 'User and product are required' });
      }
      // Check if the product already exists in the user's cart
      let cartItem = await Cart.findOne({ user, product });
      if (cartItem) {
        // If the product exists, update the quantity
        cartItem.quantity += 1; // Default increment quantity
        await cartItem.save();
        return res.status(200).json({
          success: true,
          message: 'Cart item updated successfully',
          carts: cartItem
        });
      } else {
        // If the product does not exist, create a new cart item with default quantity
        const newCartItem = new Cart({
          user,
          product,
          quantity: 1, // Default quantity
        });
        await newCartItem.save();
        return res.status(201).json({
          success: true,
          message: 'Cart item created successfully',
          carts: newCartItem
        });
      }
    } catch (error) {
      console.error('Error creating or updating cart item:', error);
      res.status(500).json({ success: false, message: 'Server error: ' + error.message });
    }
  };
  
// Get all cart items
const getAllCarts = async (req, res) => {
  try {
    const cartItems = await Cart.find().populate('user').populate('product');
    res.status(200).json({
      success: true,
      message: 'Cart items retrieved successfully',
      carts: cartItems
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error: ' + error.message });
  }
};

// Get a specific cart item by ID
const getCartById = async (req, res) => {
  try {
    let id=req.user;
    const cartItem = await Cart.find({user:id}).populate('user').populate('product');
    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: 'Cart item not found'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Cart item retrieved successfully',
      carts: cartItem
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error: ' + error.message });
  }
};


const updateCart = async (req, res) => {
    try {
      const { id } = req.params;
      const { quantity } = req.body;
      if (quantity === 0) {
        // Remove the cart item if quantity is 0
        await Cart.findByIdAndDelete(id);
        res.status(200).json({
          success: true,
          message: 'Cart item removed successfully',
        });
      } else {
        const updatedCart = {};
        if (quantity) updatedCart.quantity = quantity;
        const updatedCartItem = await Cart.findByIdAndUpdate(
          id,
          { $set: updatedCart },
          { new: true }
        );
        res.status(200).json({
          success: true,
          message: 'Cart item updated successfully',
          cart: updatedCartItem
        });
      }
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server error: ' + error.message });
    }
  };
  

// Delete a cart item by ID
const deleteCart = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCartItem = await Cart.findByIdAndDelete(id);

    if (!deletedCartItem) {
      return res.status(404).json({
        success: false,
        message: 'Cart item not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Cart item deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error: ' + error.message });
  }
};

module.exports = {
  createCart,
  getAllCarts,
  getCartById,
  updateCart,
  deleteCart,
};
