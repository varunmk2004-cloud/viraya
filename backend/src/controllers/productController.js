import Product from '../models/Product.js';
import { checkStockAvailability } from '../utils/stockUtils.js';

export const checkAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const { start, end } = req.query;

    if (!start || !end) {
      return res.status(400).json({ message: 'Start and end dates are required' });
    }

    const startDate = new Date(start);
    const endDate = new Date(end);
    
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        return res.status(400).json({ message: 'Invalid dates' });
    }

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const { available, maxUsed } = await checkStockAvailability(product, startDate, endDate);

    res.json({ 
      productId: id,
      totalStock: product.stock,
      maxUsedInPeriod: maxUsed,
      available
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

export const getProducts = async (req, res) => {
  const { search, category, isRental } = req.query;
  const q = {};
  if (search) q.title = { $regex: search, $options: 'i' };
  if (category) q.category = category;
  if (isRental !== undefined) q.isRental = isRental === 'true';
  const products = await Product.find(q).populate('seller', 'name email');
  res.json(products);
};

export const getProduct = async (req, res) => {
  const p = await Product.findById(req.params.id).populate('seller', 'name email');
  if (!p) return res.status(404).json({ msg: 'Not found' });
  res.json(p);
};

export const createProduct = async (req, res) => {
  try {
    const prod = await Product.create({ ...req.body, seller: req.user._id });
    res.json(prod);
  } catch (err) { res.status(500).json({ err: err.message }); }
};

export const updateProduct = async (req, res) => {
  const prod = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(prod);
};

export const deleteProduct = async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ msg: 'Deleted' });
};
