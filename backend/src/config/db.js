import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is not defined in environment variables. Please check your .env file.');
    }
    
    // Check if placeholder password is still in use
    if (process.env.MONGO_URI.includes('YOUR_PASSWORD_HERE') || process.env.MONGO_URI.includes('<db_password>')) {
      throw new Error('Please replace YOUR_PASSWORD_HERE or <db_password> in your .env file with your actual MongoDB Atlas password.');
    }
    
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000, // Timeout after 10s
    });
    console.log('✅ MongoDB connected successfully:', conn.connection.host);
  } catch (err) {
    if (err.message.includes('authentication failed')) {
      console.error('❌ MongoDB Authentication Error:');
      console.error('   Please check your MongoDB Atlas username and password in the .env file.');
      console.error('   Make sure to:');
      console.error('   1. Replace YOUR_PASSWORD_HERE with your actual password');
      console.error('   2. URL-encode special characters in your password (e.g., @ becomes %40)');
      console.error('   3. Verify your database user exists in MongoDB Atlas');
    } else if (err.message.includes('whitelist') || err.message.includes('IP') || err.code === 'ENOTFOUND' || err.message.includes('could not connect')) {
      console.error('❌ MongoDB Connection Error - IP Address Not Whitelisted:');
      console.error('   Your IP address is not whitelisted in MongoDB Atlas.');
      console.error('');
      console.error('   To fix this:');
      console.error('   1. Go to https://cloud.mongodb.com/');
      console.error('   2. Click "Network Access" in the left sidebar');
      console.error('   3. Click "Add IP Address"');
      console.error('   4. Click "Add Current IP Address" (or add 0.0.0.0/0 for all IPs - less secure)');
      console.error('   5. Wait 1-2 minutes for changes to take effect');
      console.error('   6. Restart your server');
      console.error('');
      console.error('   Quick link: https://cloud.mongodb.com/v2#/security/network/whitelist');
    } else {
      console.error('❌ DB connect error:', err.message);
      if (err.code) {
        console.error('   Error code:', err.code);
      }
    }
    process.exit(1);
  }
};

export default connectDB;
