/**
 * Test script to verify admin login credentials
 */
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

dotenv.config();

const testLogin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to database');

    const email = 'admin@viraya.com';
    const password = 'adminpass';
    
    // Find user with password field
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    
    if (!user) {
      console.log('❌ Admin user not found');
      process.exit(1);
    }
    
    console.log('✅ Admin user found');
    console.log(`   Email: ${user.email}`);
    console.log(`   Role: ${user.role}`);
    console.log(`   Password hash exists: ${!!user.password}`);
    console.log(`   Password hash length: ${user.password ? user.password.length : 0}`);
    
    // Test password comparison
    const match = await bcrypt.compare(password, user.password);
    
    if (match) {
      console.log('✅ Password verification successful!');
    } else {
      console.log('❌ Password verification failed!');
      console.log('   Attempting to rehash password...');
      
      // Rehash the password
      const newHash = await bcrypt.hash(password, 12);
      user.password = newHash;
      await user.save({ validateBeforeSave: false });
      
      // Test again
      const newMatch = await bcrypt.compare(password, user.password);
      if (newMatch) {
        console.log('✅ Password rehashed and verified successfully!');
      } else {
        console.log('❌ Still failing after rehash');
      }
    }

    await mongoose.connection.close();
    console.log('\n✅ Test completed');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  }
};

testLogin();
