import Cart from '../models/Cart.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';

// Dummy payment: accept instantly
export const checkout = async (req, res) => {
  try {
    const { name, email, phone, address, city, zipCode, paymentMethod } = req.body || {};
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }
    
    const items = cart.items.map(i => {
      if (!i.product) {
        throw new Error('Product not found in cart item');
      }
      // For rental items, use rental pricePerDay; for purchase items, use price
      const price = i.type === 'rental' 
        ? (i.product.rental?.pricePerDay || 0)
        : (i.product.price || 0);
      
      return {
        product: i.product._id,
        qty: i.qty,
        price: price,
        type: i.type,
        rentalStart: i.rentalStart,
        rentalEnd: i.rentalEnd
      };
    });
    
    const total = items.reduce((s, it) => s + it.qty * it.price, 0);
    
    const order = await Order.create({
      buyer: req.user._id,
      items,
      total,
      paymentStatus: 'paid',
      paymentInfo: { method: paymentMethod || 'dummy' },
      shippingAddress: {
        name,
        email,
        phone,
        address,
        city,
        zipCode
      }
    });
    
    // Reduce stock for purchased items
    for (const it of cart.items) {
      if (it.type === 'purchase' && it.product) {
        await Product.findByIdAndUpdate(it.product._id, { $inc: { stock: -(it.qty) } });
      }
    }
    
    // Clear cart
    cart.items = [];
    await cart.save();
    
    res.json({ order });
  } catch (err) {
    console.error('Checkout error:', err);
    res.status(500).json({ message: err.message || 'Failed to process order' });
  }
};

export const getUserOrders = async (req, res) => {
  const orders = await Order.find({ buyer: req.user._id }).populate('items.product');
  res.json(orders);
};

export const getAllOrders = async (req, res) => {
  const orders = await Order.find().populate('buyer', 'name email').populate('items.product');
  res.json(orders);
};
