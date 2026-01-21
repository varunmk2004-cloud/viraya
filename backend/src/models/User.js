import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  password: { type: String, required: true, select: false },
  role: { type: String, enum: ['customer','seller','admin','delivery'], default: 'customer' },
  refreshToken: { type: String, select: false },
  passwordResetToken: { type: String, select: false },
  passwordResetExpires: { type: Date, select: false },
  lastLogin: { type: Date },
  loginAttempts: { type: Number, default: 0, select: false },
  lockUntil: { type: Date, select: false },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

// Index for faster queries
userSchema.index({ email: 1 });

export default mongoose.model('User', userSchema);
