/**
 * Script to update stock values for existing products without deleting them.
 * Run with: node src/seed/updateStock.js (ensure NODE_ENV and MONGO_URI are set)
 */
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';
dotenv.config();

// Stock values to update (matching product titles)
const stockUpdates = {
  'Luxury Gold Table Linens Set': { stock: 175, minimumStock: 5 },
  'Crystal Chandelier - Grand': { stock: 75, minimumStock: 2 },
  'Premium Event Signage Package': { stock: 275, minimumStock: 10 },
  'Professional Stage Setup': { stock: 45, minimumStock: 1 },
  'Luxury Sound System Package': { stock: 55, minimumStock: 2 },
  'LED Video Wall - 4K': { stock: 40, minimumStock: 1 },
  'Elegant Gold Chiavari Chairs': { stock: 525, minimumStock: 20 },
  'Luxury Lounge Furniture Set': { stock: 65, minimumStock: 2 },
  'Professional Photography Lighting Kit': { stock: 75, minimumStock: 2 },
  'Floral Arch - Premium': { stock: 60, minimumStock: 1 },
  'Marble Top Cocktail Tables': { stock: 225, minimumStock: 10 },
  'Wireless Microphone System': { stock: 85, minimumStock: 3 },
  'Projector & Screen Package': { stock: 65, minimumStock: 2 },
  'Elegant Centerpiece Collection': { stock: 175, minimumStock: 5 },
  'Red Carpet & Stanchions': { stock: 75, minimumStock: 2 },
  'Portable Bar Setup': { stock: 60, minimumStock: 1 },
  'DJ Equipment Package': { stock: 50, minimumStock: 1 },
  'Luxury Table Settings': { stock: 325, minimumStock: 10 },
  'Outdoor Tent - Premium': { stock: 55, minimumStock: 1 },
  'Smoke Machine & Effects': { stock: 65, minimumStock: 2 },
  'Premium Backdrop Collection': { stock: 105, minimumStock: 3 }
};

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to database for stock update');

    let updatedCount = 0;
    let notFoundCount = 0;

    for (const [title, updates] of Object.entries(stockUpdates)) {
      const product = await Product.findOne({ title });
      
      if (product) {
        await Product.findByIdAndUpdate(
          product._id,
          { 
            $set: { 
              stock: updates.stock,
              minimumStock: updates.minimumStock 
            } 
          },
          { new: true }
        );
        console.log(`✅ Updated: ${title} - Stock: ${updates.stock}, Minimum Stock: ${updates.minimumStock}`);
        updatedCount++;
      } else {
        console.log(`❌ Not found: ${title}`);
        notFoundCount++;
      }
    }

    console.log('\n📊 Update Summary:');
    console.log(`✅ Successfully updated: ${updatedCount} products`);
    console.log(`❌ Not found: ${notFoundCount} products`);
    console.log('\n✨ Stock update completed!');
    
  } catch (error) {
    console.error('❌ Error updating stocks:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from database');
    process.exit(0);
  }
};

run();
