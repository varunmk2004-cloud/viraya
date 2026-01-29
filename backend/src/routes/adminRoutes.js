import express from 'express';
import { protect } from '../middleware/auth.js';
import { isAdmin } from '../middleware/roles.js';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';

const r = express.Router();
r.use(protect, isAdmin);

// Users
r.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

r.put('/users/:id', async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

r.delete('/users/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

r.delete('/users', async (req, res) => {
  try {
    const result = await User.deleteMany({ role: { $ne: 'admin' } });
    res.json({ 
      message: 'All non-admin users deleted successfully',
      deletedCount: result.deletedCount 
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Products
r.get('/products', async (req, res) => {
  try {
    const products = await Product.find().populate('seller', 'name email');
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

r.post('/products', async (req, res) => {
  try {
    const product = await Product.create({ ...req.body, seller: req.user._id });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

r.put('/products/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

r.delete('/products/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Orders
r.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find().populate('buyer', 'name email').populate('items.product');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default r;
