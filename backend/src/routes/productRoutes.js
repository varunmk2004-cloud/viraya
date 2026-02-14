import express from 'express';
import { getProducts, getProduct, createProduct, updateProduct, deleteProduct, checkAvailability } from '../controllers/productController.js';
import { protect } from '../middleware/auth.js';
import { isSeller } from '../middleware/roles.js';

const r = express.Router();
r.get('/', getProducts);
r.get('/:id/availability', checkAvailability);
r.get('/:id', getProduct);
r.post('/', protect, isSeller, createProduct);
r.put('/:id', protect, isSeller, updateProduct);
r.delete('/:id', protect, isSeller, deleteProduct);
export default r;
