import Rental from '../models/Rental.js';
import Product from '../models/Product.js';
import { checkStockAvailability } from '../utils/stockUtils.js';

const isAvailable = async (productId, startDate, endDate) => {
  const product = await Product.findById(productId);
  if (!product) return false;

  const { available } = await checkStockAvailability(product, startDate, endDate);
  return available >= 1;
};

export const requestRental = async (req, res) => {
  const { productId, startDate, endDate } = req.body;
  const product = await Product.findById(productId);
  if (!product || !product.isRental) return res.status(400).json({ msg: 'Not rentable' });
  const sd = new Date(startDate), ed = new Date(endDate);
  const available = await isAvailable(productId, sd, ed);
  if (!available) return res.status(400).json({ msg: 'Not available for chosen dates' });
  const days = Math.ceil((ed - sd) / (1000*60*60*24)) + 1;
  const total = (product.rental.pricePerDay || 0) * days;
  const deposit = product.rental.deposit || 0;
  const rental = await Rental.create({ renter: req.user._id, product: productId, startDate: sd, endDate: ed, totalAmount: total, deposit, status: 'requested', paymentInfo: { method: 'dummy', paid: true } });
  res.json(rental);
};

export const sellerRentalRequests = async (req, res) => {
  const products = await Product.find({ seller: req.user._id }).select('_id');
  const productIds = products.map(p => p._id);
  const requests = await Rental.find({ product: { $in: productIds } }).populate('renter product');
  res.json(requests);
};

export const updateRentalStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const rental = await Rental.findById(id).populate('product renter');
  if (!rental) return res.status(404).json({ msg: 'Not found' });
  rental.status = status;
  await rental.save();
  res.json(rental);
};

export const getUserRentals = async (req, res) => {
  const rentals = await Rental.find({ renter: req.user._id }).populate('product');
  res.json(rentals);
};

export const getAllRentals = async (req, res) => {
  const rentals = await Rental.find().populate('product renter');
  res.json(rentals);
};
