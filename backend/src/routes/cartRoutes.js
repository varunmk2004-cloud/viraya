import express from 'express';
import { protect } from '../middleware/auth.js';
import { getCart, addToCart, removeFromCart } from '../controllers/cartController.js';

const r = express.Router();
r.use(protect);
r.get('/', getCart);
r.post('/add', addToCart);
r.delete('/remove/:productId', removeFromCart);
export default r;
