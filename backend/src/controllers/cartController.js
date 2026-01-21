import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

export const getCart = async (req, res) => {
  let cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
  if (!cart) cart = await Cart.create({ user: req.user._id, items: [] });
  res.json(cart);
};

export const addToCart = async (req, res) => {
  const { productId, qty = 1, type = 'purchase', rentalStart, rentalEnd } = req.body;
  const product = await Product.findById(productId);
  if (!product) return res.status(404).json({ msg: 'Product not found' });
  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) cart = await Cart.create({ user: req.user._id, items: [] });
  const idx = cart.items.findIndex(i => i.product.toString() === productId && i.type === type && (!i.rentalStart || i.rentalStart?.toString()===rentalStart));
  if (idx > -1) cart.items[idx].qty += qty;
  else cart.items.push({ product: productId, qty, type, rentalStart, rentalEnd });
  await cart.save();
  res.json(cart);
};

export const removeFromCart = async (req, res) => {
  const { productId } = req.params;
  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) return res.status(404).json({ msg: 'Cart not found' });
  cart.items = cart.items.filter(i => i.product.toString() !== productId);
  await cart.save();
  res.json(cart);
};
