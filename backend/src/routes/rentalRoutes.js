import express from 'express';
import { protect } from '../middleware/auth.js';
import { requestRental, sellerRentalRequests, updateRentalStatus, getUserRentals, getAllRentals } from '../controllers/rentalController.js';
import { isSeller, isAdmin } from '../middleware/roles.js';

const r = express.Router();
r.post('/request', protect, requestRental);
r.get('/my', protect, getUserRentals);
r.get('/seller', protect, isSeller, sellerRentalRequests);
r.put('/:id/status', protect, isSeller, updateRentalStatus);
r.get('/', protect, isAdmin, getAllRentals);
export default r;
