/**
 * Simple seed script to create an admin user and sample products.
 * Run with: node src/seed/seed.js (ensure NODE_ENV and MONGO_URI are set)
 */
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Product from '../models/Product.js';
dotenv.config();

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected for seeding');
  await User.deleteMany({});
  await Product.deleteMany({});
  const admin = await User.create({ name: 'Admin', email: 'admin@viraya.com', password: await bcrypt.hash('adminpass', 10), role: 'admin' });
  // Purchase Products
  await Product.create({
    title: 'Luxury Gold Table Linens Set',
    description: 'Premium satin table linens in elegant gold. Perfect for weddings and high-end events. Set includes tablecloth, napkins, and runners.',
    price: 299,
    stock: 50,
    lowStockThreshold: 10,
    isRental: false,
    category: 'Decor',
    image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&h=600&fit=crop'
    ],
    seller: admin._id
  });

  await Product.create({
    title: 'Crystal Chandelier - Grand',
    description: 'Stunning 8-arm crystal chandelier with LED lighting. Creates an elegant ambiance for any luxury event. Perfect for ballrooms and grand halls.',
    price: 2499,
    stock: 15,
    lowStockThreshold: 3,
    isRental: false,
    category: 'Lighting',
    image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=800&h=600&fit=crop'
    ],
    seller: admin._id
  });

  await Product.create({
    title: 'Premium Event Signage Package',
    description: 'Custom-designed event signage package. Includes welcome signs, directional boards, and personalized banners. Professional printing on premium materials.',
    price: 450,
    stock: 100,
    lowStockThreshold: 20,
    isRental: false,
    category: 'Signage',
    image: 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&h=600&fit=crop'
    ],
    seller: admin._id
  });

  // Rental Products
  await Product.create({
    title: 'Professional Stage Setup',
    description: 'Complete professional stage setup with premium flooring, backdrop, and safety railings. Perfect for corporate events, concerts, and ceremonies.',
    price: 0,
    stock: 5,
    lowStockThreshold: 1,
    isRental: true,
    rental: { pricePerDay: 2500, deposit: 5000 },
    category: 'Staging',
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=800&h=600&fit=crop'
    ],
    seller: admin._id
  });

  await Product.create({
    title: 'Luxury Sound System Package',
    description: 'High-end audio system with wireless microphones, speakers, and mixing console. Professional-grade equipment for flawless sound quality.',
    price: 0,
    stock: 8,
    lowStockThreshold: 2,
    isRental: true,
    rental: { pricePerDay: 1200, deposit: 3000 },
    category: 'Audio',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=600&fit=crop'
    ],
    seller: admin._id
  });

  await Product.create({
    title: 'LED Video Wall - 4K',
    description: 'Premium LED video wall display with 4K resolution. Perfect for presentations, live streaming, and visual displays. Includes setup and technical support.',
    price: 0,
    stock: 4,
    lowStockThreshold: 1,
    isRental: true,
    rental: { pricePerDay: 3500, deposit: 8000 },
    category: 'Visual',
    image: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1533750516457-a7f992034fec?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=600&fit=crop'
    ],
    seller: admin._id
  });

  await Product.create({
    title: 'Elegant Gold Chiavari Chairs',
    description: 'Premium gold-finished chiavari chairs with comfortable cushions. Classic elegance for weddings and formal events. Available in sets of 50.',
    price: 0,
    stock: 200,
    lowStockThreshold: 30,
    isRental: true,
    rental: { pricePerDay: 8, deposit: 15 },
    category: 'Furniture',
    image: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&h=600&fit=crop'
    ],
    seller: admin._id
  });

  await Product.create({
    title: 'Luxury Lounge Furniture Set',
    description: 'Modern luxury lounge set with sofas, coffee tables, and accent pieces. Perfect for VIP areas and upscale event lounges. Creates sophisticated ambiance.',
    price: 0,
    stock: 12,
    lowStockThreshold: 3,
    isRental: true,
    rental: { pricePerDay: 450, deposit: 1000 },
    category: 'Furniture',
    image: 'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800&h=600&fit=crop'
    ],
    seller: admin._id
  });

  await Product.create({
    title: 'Professional Photography Lighting Kit',
    description: 'Complete professional photography lighting setup with softboxes, stands, and modifiers. Perfect for event photography and videography.',
    price: 0,
    stock: 15,
    lowStockThreshold: 3,
    isRental: true,
    rental: { pricePerDay: 350, deposit: 800 },
    category: 'Lighting',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=800&h=600&fit=crop'
    ],
    seller: admin._id
  });

  await Product.create({
    title: 'Floral Arch - Premium',
    description: 'Stunning floral arch decorated with premium flowers and greenery. Perfect for ceremonies, photo backdrops, and entrance displays. Customizable design.',
    price: 0,
    stock: 10,
    lowStockThreshold: 2,
    isRental: true,
    rental: { pricePerDay: 600, deposit: 1200 },
    category: 'Decor',
    image: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=800&h=600&fit=crop'
    ],
    seller: admin._id
  });

  await Product.create({
    title: 'Marble Top Cocktail Tables',
    description: 'Elegant marble-top cocktail tables with gold accents. Perfect for cocktail hours and networking events. Available in sets of 10.',
    price: 0,
    stock: 80,
    lowStockThreshold: 15,
    isRental: true,
    rental: { pricePerDay: 25, deposit: 50 },
    category: 'Furniture',
    image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=800&h=600&fit=crop'
    ],
    seller: admin._id
  });

  await Product.create({
    title: 'Wireless Microphone System',
    description: 'Professional wireless microphone system with multiple receivers. Crystal clear audio for speeches, presentations, and performances.',
    price: 0,
    stock: 20,
    lowStockThreshold: 5,
    isRental: true,
    rental: { pricePerDay: 200, deposit: 500 },
    category: 'Audio',
    image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=600&fit=crop'
    ],
    seller: admin._id
  });

  await Product.create({
    title: 'Projector & Screen Package',
    description: 'High-quality projector with large projection screen. Perfect for presentations, movie screenings, and visual displays. Includes setup.',
    price: 0,
    stock: 12,
    lowStockThreshold: 3,
    isRental: true,
    rental: { pricePerDay: 300, deposit: 700 },
    category: 'Visual',
    image: 'https://images.unsplash.com/photo-1533750516457-a7f992034fec?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1533750516457-a7f992034fec?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=600&fit=crop'
    ],
    seller: admin._id
  });

  await Product.create({
    title: 'Elegant Centerpiece Collection',
    description: 'Premium centerpiece collection with crystal vases, candles, and floral arrangements. Available in various styles to match your event theme.',
    price: 0,
    stock: 50,
    lowStockThreshold: 10,
    isRental: true,
    rental: { pricePerDay: 35, deposit: 70 },
    category: 'Decor',
    image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=800&h=600&fit=crop'
    ],
    seller: admin._id
  });

  await Product.create({
    title: 'Red Carpet & Stanchions',
    description: 'Luxury red carpet with gold stanchions and velvet ropes. Perfect for VIP entrances and creating an exclusive atmosphere.',
    price: 0,
    stock: 15,
    lowStockThreshold: 3,
    isRental: true,
    rental: { pricePerDay: 150, deposit: 300 },
    category: 'Decor',
    image: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=800&h=600&fit=crop'
    ],
    seller: admin._id
  });

  await Product.create({
    title: 'Portable Bar Setup',
    description: 'Complete portable bar setup with counter, shelving, and lighting. Perfect for cocktail parties and beverage service. Professional appearance.',
    price: 0,
    stock: 10,
    lowStockThreshold: 2,
    isRental: true,
    rental: { pricePerDay: 400, deposit: 900 },
    category: 'Furniture',
    image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800&h=600&fit=crop'
    ],
    seller: admin._id
  });

  await Product.create({
    title: 'DJ Equipment Package',
    description: 'Professional DJ setup with turntables, mixer, speakers, and lighting effects. Everything needed for an amazing party experience.',
    price: 0,
    stock: 6,
    lowStockThreshold: 2,
    isRental: true,
    rental: { pricePerDay: 800, deposit: 2000 },
    category: 'Audio',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&h=600&fit=crop'
    ],
    seller: admin._id
  });

  await Product.create({
    title: 'Luxury Table Settings',
    description: 'Complete luxury table setting package with fine china, crystal glassware, and premium silverware. Elevates any dining experience.',
    price: 0,
    stock: 100,
    lowStockThreshold: 20,
    isRental: true,
    rental: { pricePerDay: 12, deposit: 25 },
    category: 'Tableware',
    image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&h=600&fit=crop'
    ],
    seller: admin._id
  });

  await Product.create({
    title: 'Outdoor Tent - Premium',
    description: 'High-quality weatherproof tent with sidewalls and flooring. Perfect for outdoor events, weddings, and garden parties. Various sizes available.',
    price: 0,
    stock: 8,
    lowStockThreshold: 2,
    isRental: true,
    rental: { pricePerDay: 600, deposit: 1500 },
    category: 'Staging',
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&h=600&fit=crop'
    ],
    seller: admin._id
  });

  await Product.create({
    title: 'Smoke Machine & Effects',
    description: 'Professional smoke machine with various effect options. Creates dramatic atmosphere for performances, parties, and special events.',
    price: 0,
    stock: 12,
    lowStockThreshold: 3,
    isRental: true,
    rental: { pricePerDay: 180, deposit: 400 },
    category: 'Effects',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=800&h=600&fit=crop'
    ],
    seller: admin._id
  });

  await Product.create({
    title: 'Premium Backdrop Collection',
    description: 'Collection of premium backdrops in various styles - floral, geometric, and custom designs. Perfect for photo booths and event photography.',
    price: 0,
    stock: 25,
    lowStockThreshold: 5,
    isRental: true,
    rental: { pricePerDay: 120, deposit: 250 },
    category: 'Decor',
    image: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=800&h=600&fit=crop'
    ],
    seller: admin._id
  });

  console.log('Seeded with luxury event production products');
  process.exit(0);
};
run();
