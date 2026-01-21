import express from 'express';
import { protect } from '../middleware/auth.js';
import { checkout, getUserOrders, getAllOrders } from '../controllers/orderController.js';
import { isAdmin } from '../middleware/roles.js';

const r = express.Router();
r.use(protect);
r.post('/checkout', checkout);
r.get('/my', getUserOrders);
r.get('/', isAdmin, getAllOrders);
export default r;
