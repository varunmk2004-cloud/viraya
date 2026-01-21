import Product from '../models/Product.js';

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
