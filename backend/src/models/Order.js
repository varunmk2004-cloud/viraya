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
  status: { type: String, enum: ['pending','approved','rejected'], default: 'pending' },
  paymentStatus: { type: String, enum: ['pending','paid','failed'], default: 'pending' },
  paymentInfo: Object,
  shippingAddress: {
    name: String,
    email: String,
    phone: String,
    address: String,
    city: String,
    zipCode: String
  },
  // Delivery fields removed for simplified flow
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);
