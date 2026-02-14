import Cart from '../models/Cart.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { checkStockAvailability } from '../utils/stockUtils.js';

// Dummy payment: accept instantly
export const checkout = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Validate availability
    for (const it of cart.items) {
      if (!it.product) continue; // Should be handled, but safety check

      if (it.type === 'rental') {
        const { available } = await checkStockAvailability(it.product, it.rentalStart, it.rentalEnd);
        // Note: The current cart item itself is NOT in the Order/Rental collection yet,
        // so checkStockAvailability won't count it.
        // We just need to ensure available >= qty.
        if (available < it.qty) {
          return res.status(400).json({ 
            message: `Product "${it.product.title}" is not available for the selected dates (Requested: ${it.qty}, Available: ${available})` 
          });
        }
      } else {
        // Purchase
        if (it.product.stock < it.qty) {
          return res.status(400).json({ 
            message: `Product "${it.product.title}" is out of stock (Requested: ${it.qty}, Available: ${it.product.stock})` 
          });
        }
      }
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
      paymentStatus: 'pending',
      paymentInfo: { method: 'whatsapp' }
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
