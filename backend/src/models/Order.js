import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  qty: Number,
  price: Number,
  type: { type: String, enum: ['purchase','rental'], default: 'purchase' },
  rentalStart: Date,
  rentalEnd: Date
});

const orderSchema = new mongoose.Schema({
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items: [orderItemSchema],
  total: Number,
  paymentStatus: { type: String, enum: ['pending','paid','failed'], default: 'pending' },
  paymentInfo: Object
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);
