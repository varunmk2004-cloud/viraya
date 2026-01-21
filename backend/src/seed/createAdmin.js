/**
 * Script to create or update admin user
 * Run with: node src/seed/createAdmin.js
 */
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to database');

    const adminEmail = 'admin@viraya.com';
    const adminPassword = 'adminpass';
    
    // Check if admin exists
    let admin = await User.findOne({ email: adminEmail });
    
    if (admin) {
      // Update existing admin password
      const hash = await bcrypt.hash(adminPassword, 12);
      admin.password = hash;
      admin.role = 'admin';
      admin.isActive = true;
      admin.loginAttempts = 0;
      admin.lockUntil = undefined;
      await admin.save();
      console.log('✅ Admin user updated successfully');
    } else {
      // Create new admin
      const hash = await bcrypt.hash(adminPassword, 12);
      admin = await User.create({
        name: 'Admin',
        email: adminEmail,
        password: hash,
        role: 'admin',
        isActive: true
      });
      console.log('✅ Admin user created successfully');
    }
    
    console.log(`\n📋 Admin Credentials:`);
    console.log(`   Email: ${adminEmail}`);
    console.log(`   Password: ${adminPassword}`);
    console.log(`   Role: ${admin.role}`);
    console.log(`   ID: ${admin._id}`);

    await mongoose.connection.close();
    console.log('\n✅ Database connection closed');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
};

createAdmin();
