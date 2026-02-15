import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  image: String,
  images: [String],
  category: String,
  price: { type: Number, default: 0 },
  stock: { type: Number, default: 0 },
  minimumStock: { type: Number, default: 0 },
  lowStockThreshold: { type: Number, default: 10 },
  isRental: { type: Boolean, default: false },
  rental: {
    pricePerDay: { type: Number, default: 0 },
    deposit: { type: Number, default: 0 }
  },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

export default mongoose.model('Product', productSchema);
