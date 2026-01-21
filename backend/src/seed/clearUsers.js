/**
 * Script to clear all non-admin users from the database
 * Run with: node src/seed/clearUsers.js
 */
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const clearNonAdminUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to database');

    // Delete all users except admins
    const result = await User.deleteMany({ role: { $ne: 'admin' } });
    
    console.log(`✅ Successfully deleted ${result.deletedCount} non-admin user(s)`);
    
    // Show remaining users
    const remainingUsers = await User.find().select('name email role');
    console.log(`\n📋 Remaining users (${remainingUsers.length}):`);
    remainingUsers.forEach(user => {
      console.log(`   - ${user.name} (${user.email}) - Role: ${user.role}`);
    });

    await mongoose.connection.close();
    console.log('\n✅ Database connection closed');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
};

clearNonAdminUsers();
