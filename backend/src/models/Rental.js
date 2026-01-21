import mongoose from 'mongoose';

const rentalSchema = new mongoose.Schema({
  renter: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  startDate: Date,
  endDate: Date,
  totalAmount: Number,
  deposit: Number,
  status: { type: String, enum: ['requested','approved','rejected','ongoing','returned'], default: 'requested' },
  paymentInfo: Object
}, { timestamps: true });

export default mongoose.model('Rental', rentalSchema);
