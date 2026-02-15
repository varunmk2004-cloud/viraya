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
    stock: 175,
    minimumStock: 5,
    lowStockThreshold: 10,
    isRental: false,
    category: 'Decor',
    // Replace this URL with your actual image URL or path
    // Option 1: If hosting externally, use: 'https://your-domain.com/images/table-linens.jpg'
    // Option 2: If using public folder, use: '/images/table-linens.jpg'
    image: '/images/table-linens-main.jpg',
    images: [
      '/images/table-linens-main.jpg',
      '/images/table-linens-1.jpg',
      '/images/table-linens-2.jpg'
    ],
    seller: admin._id
  });

  await Product.create({
    title: 'Crystal Chandelier - Grand',
    description: 'Stunning 8-arm crystal chandelier with LED lighting. Creates an elegant ambiance for any luxury event. Perfect for ballrooms and grand halls.',
    price: 2499,
    stock: 75,
    minimumStock: 2,
    lowStockThreshold: 3,
    isRental: false,
    category: 'Lighting',
    image: 'https://dummyimage.com/800x600/4169E1/FFFFFF.png&text=Crystal+Chandelier',
    images: [
      'https://dummyimage.com/800x600/4169E1/FFFFFF.png&text=Chandelier+1',
      'https://dummyimage.com/800x600/1E3A8A/FFFFFF.png&text=Chandelier+2',
      'https://dummyimage.com/800x600/6B9FFF/FFFFFF.png&text=Chandelier+3'
    ],
    seller: admin._id
  });

  await Product.create({
    title: 'Premium Event Signage Package',
    description: 'Custom-designed event signage package. Includes welcome signs, directional boards, and personalized banners. Professional printing on premium materials.',
    price: 450,
    stock: 275,
    minimumStock: 10,
    lowStockThreshold: 20,
    isRental: false,
    category: 'Signage',
    image: 'https://dummyimage.com/800x600/4169E1/FFFFFF.png&text=Event+Signage',
    images: [
      'https://dummyimage.com/800x600/4169E1/FFFFFF.png&text=Signage+1',
      'https://dummyimage.com/800x600/1E3A8A/FFFFFF.png&text=Signage+2',
      'https://dummyimage.com/800x600/6B9FFF/FFFFFF.png&text=Signage+3'
    ],
    seller: admin._id
  });

  // Rental Products
  await Product.create({
    title: 'Professional Stage Setup',
    description: 'Complete professional stage setup with premium flooring, backdrop, and safety railings. Perfect for corporate events, concerts, and ceremonies.',
    price: 0,
    stock: 45,
    minimumStock: 1,
    lowStockThreshold: 1,
    isRental: true,
    rental: { pricePerDay: 2500, deposit: 5000 },
    category: 'Staging',
    image: 'https://dummyimage.com/800x600/4169E1/FFFFFF.png&text=Stage+Setup',
    images: [
      'https://dummyimage.com/800x600/4169E1/FFFFFF.png&text=Stage+1',
      'https://dummyimage.com/800x600/1E3A8A/FFFFFF.png&text=Stage+2',
      'https://dummyimage.com/800x600/6B9FFF/FFFFFF.png&text=Stage+3'
    ],
    seller: admin._id
  });

  await Product.create({
    title: 'Luxury Sound System Package',
    description: 'High-end audio system with wireless microphones, speakers, and mixing console. Professional-grade equipment for flawless sound quality.',
    price: 0,
    stock: 55,
    minimumStock: 2,
    lowStockThreshold: 2,
    isRental: true,
    rental: { pricePerDay: 1200, deposit: 3000 },
    category: 'Audio',
    image: 'https://dummyimage.com/800x600/4169E1/FFFFFF.png&text=Sound+System',
    images: [
      'https://dummyimage.com/800x600/4169E1/FFFFFF.png&text=Sound+1',
      'https://dummyimage.com/800x600/1E3A8A/FFFFFF.png&text=Sound+2',
      'https://dummyimage.com/800x600/6B9FFF/FFFFFF.png&text=Sound+3'
    ],
    seller: admin._id
  });

  await Product.create({
    title: 'LED Video Wall - 4K',
    description: 'Premium LED video wall display with 4K resolution. Perfect for presentations, live streaming, and visual displays. Includes setup and technical support.',
    price: 0,
    stock: 40,
    minimumStock: 1,
    lowStockThreshold: 1,
    isRental: true,
    rental: { pricePerDay: 3500, deposit: 8000 },
    category: 'Visual',
    image: 'https://dummyimage.com/800x600/4169E1/FFFFFF.png&text=LED+Video+Wall',
    images: [
      'https://dummyimage.com/800x600/4169E1/FFFFFF.png&text=LED+1',
      'https://dummyimage.com/800x600/1E3A8A/FFFFFF.png&text=LED+2',
      'https://dummyimage.com/800x600/6B9FFF/FFFFFF.png&text=LED+3'
    ],
    seller: admin._id
  });

  await Product.create({
    title: 'Elegant Gold Chiavari Chairs',
    description: 'Premium gold-finished chiavari chairs with comfortable cushions. Classic elegance for weddings and formal events. Available in sets of 50.',
    price: 0,
    stock: 525,
    minimumStock: 20,
    lowStockThreshold: 30,
    isRental: true,
    rental: { pricePerDay: 8, deposit: 15 },
    category: 'Furniture',
    image: 'https://dummyimage.com/800x600/4169E1/FFFFFF.png&text=Chiavari+Chairs',
    images: [
      'https://dummyimage.com/800x600/4169E1/FFFFFF.png&text=Chairs+1',
      'https://dummyimage.com/800x600/1E3A8A/FFFFFF.png&text=Chairs+2',
      'https://dummyimage.com/800x600/6B9FFF/FFFFFF.png&text=Chairs+3'
    ],
    seller: admin._id
  });

  await Product.create({
    title: 'Luxury Lounge Furniture Set',
    description: 'Modern luxury lounge set with sofas, coffee tables, and accent pieces. Perfect for VIP areas and upscale event lounges. Creates sophisticated ambiance.',
    price: 0,
    stock: 65,
    minimumStock: 2,
    lowStockThreshold: 3,
    isRental: true,
    rental: { pricePerDay: 450, deposit: 1000 },
    category: 'Furniture',
    image: 'https://dummyimage.com/800x600/4169E1/FFFFFF.png&text=Lounge+Furniture',
    images: [
      'https://dummyimage.com/800x600/4169E1/FFFFFF.png&text=Lounge+1',
      'https://dummyimage.com/800x600/1E3A8A/FFFFFF.png&text=Lounge+2',
      'https://dummyimage.com/800x600/6B9FFF/FFFFFF.png&text=Lounge+3'
    ],
    seller: admin._id
  });

  await Product.create({
    title: 'Professional Photography Lighting Kit',
    description: 'Complete professional photography lighting setup with softboxes, stands, and modifiers. Perfect for event photography and videography.',
    price: 0,
    stock: 75,
    minimumStock: 2,
    lowStockThreshold: 3,
    isRental: true,
    rental: { pricePerDay: 350, deposit: 800 },
    category: 'Lighting',
    image: 'https://dummyimage.com/800x600/4169E1/FFFFFF.png&text=Photography+Lighting',
    images: [
      'https://dummyimage.com/800x600/4169E1/FFFFFF.png&text=Lighting+1',
      'https://dummyimage.com/800x600/1E3A8A/FFFFFF.png&text=Lighting+2',
      'https://dummyimage.com/800x600/6B9FFF/FFFFFF.png&text=Lighting+3'
    ],
    seller: admin._id
  });

  await Product.create({
    title: 'Floral Arch - Premium',
    description: 'Stunning floral arch decorated with premium flowers and greenery. Perfect for ceremonies, photo backdrops, and entrance displays. Customizable design.',
    price: 0,
    stock: 60,
    minimumStock: 1,
    lowStockThreshold: 2,
    isRental: true,
    rental: { pricePerDay: 600, deposit: 1200 },
    category: 'Decor',
    image: 'https://dummyimage.com/800x600/4169E1/FFFFFF.png&text=Floral+Arch',
    images: [
      'https://dummyimage.com/800x600/4169E1/FFFFFF.png&text=Floral+1',
      'https://dummyimage.com/800x600/1E3A8A/FFFFFF.png&text=Floral+2',
      'https://dummyimage.com/800x600/6B9FFF/FFFFFF.png&text=Floral+3'
    ],
    seller: admin._id
  });

  await Product.create({
    title: 'Marble Top Cocktail Tables',
    description: 'Elegant marble-top cocktail tables with gold accents. Perfect for cocktail hours and networking events. Available in sets of 10.',
    price: 0,
    stock: 225,
    minimumStock: 10,
    lowStockThreshold: 15,
    isRental: true,
    rental: { pricePerDay: 25, deposit: 50 },
    category: 'Furniture',
    image: 'https://dummyimage.com/800x600/4169E1/FFFFFF.png&text=Cocktail+Tables',
    images: [
      'https://dummyimage.com/800x600/4169E1/FFFFFF.png&text=Cocktail+1',
      'https://dummyimage.com/800x600/1E3A8A/FFFFFF.png&text=Cocktail+2',
      'https://dummyimage.com/800x600/6B9FFF/FFFFFF.png&text=Cocktail+3'
    ],
    seller: admin._id
  });

  await Product.create({
    title: 'Wireless Microphone System',
    description: 'Professional wireless microphone system with multiple receivers. Crystal clear audio for speeches, presentations, and performances.',
    price: 0,
    stock: 85,
    minimumStock: 3,
    lowStockThreshold: 5,
    isRental: true,
    rental: { pricePerDay: 200, deposit: 500 },
    category: 'Audio',
    image: 'https://dummyimage.com/800x600/4169E1/FFFFFF.png&text=Wireless+Microphone',
    images: [
      'https://dummyimage.com/800x600/4169E1/FFFFFF.png&text=Microphone+1',
      'https://dummyimage.com/800x600/1E3A8A/FFFFFF.png&text=Microphone+2',
      'https://dummyimage.com/800x600/6B9FFF/FFFFFF.png&text=Microphone+3'
    ],
    seller: admin._id
  });

  await Product.create({
    title: 'Projector & Screen Package',
    description: 'High-quality projector with large projection screen. Perfect for presentations, movie screenings, and visual displays. Includes setup.',
    price: 0,
    stock: 65,
    minimumStock: 2,
    lowStockThreshold: 3,
    isRental: true,
    rental: { pricePerDay: 300, deposit: 700 },
    category: 'Visual',
    image: 'https://dummyimage.com/800x600/4169E1/FFFFFF.png&text=Projector+Screen',
    images: [
      'https://dummyimage.com/800x600/4169E1/FFFFFF.png&text=Projector+1',
      'https://dummyimage.com/800x600/1E3A8A/FFFFFF.png&text=Projector+2',
      'https://dummyimage.com/800x600/6B9FFF/FFFFFF.png&text=Projector+3'
    ],
    seller: admin._id
  });

  await Product.create({
    title: 'Elegant Centerpiece Collection',
    description: 'Premium centerpiece collection with crystal vases, candles, and floral arrangements. Available in various styles to match your event theme.',
    price: 0,
    stock: 175,
    minimumStock: 5,
    lowStockThreshold: 10,
    isRental: true,
    rental: { pricePerDay: 35, deposit: 70 },
    category: 'Decor',
    image: 'https://dummyimage.com/800x600/4169E1/FFFFFF.png&text=Centerpiece+Collection',
    images: [
      'https://dummyimage.com/800x600/4169E1/FFFFFF.png&text=Centerpiece+1',
      'https://dummyimage.com/800x600/1E3A8A/FFFFFF.png&text=Centerpiece+2',
      'https://dummyimage.com/800x600/6B9FFF/FFFFFF.png&text=Centerpiece+3'
    ],
    seller: admin._id
  });

  await Product.create({
    title: 'Red Carpet & Stanchions',
    description: 'Luxury red carpet with gold stanchions and velvet ropes. Perfect for VIP entrances and creating an exclusive atmosphere.',
    price: 0,
    stock: 75,
    minimumStock: 2,
    lowStockThreshold: 3,
    isRental: true,
    rental: { pricePerDay: 150, deposit: 300 },
    category: 'Decor',
    image: 'https://dummyimage.com/800x600/4169E1/FFFFFF.png&text=Red+Carpet',
    images: [
      'https://dummyimage.com/800x600/4169E1/FFFFFF.png&text=Carpet+1',
      'https://dummyimage.com/800x600/1E3A8A/FFFFFF.png&text=Carpet+2',
      'https://dummyimage.com/800x600/6B9FFF/FFFFFF.png&text=Carpet+3'
    ],
    seller: admin._id
  });

  await Product.create({
    title: 'Portable Bar Setup',
    description: 'Complete portable bar setup with counter, shelving, and lighting. Perfect for cocktail parties and beverage service. Professional appearance.',
    price: 0,
    stock: 60,
    minimumStock: 1,
    lowStockThreshold: 2,
    isRental: true,
    rental: { pricePerDay: 400, deposit: 900 },
    category: 'Furniture',
    image: 'https://dummyimage.com/800x600/4169E1/FFFFFF.png&text=Portable+Bar',
    images: [
      'https://dummyimage.com/800x600/4169E1/FFFFFF.png&text=Bar+1',
      'https://dummyimage.com/800x600/1E3A8A/FFFFFF.png&text=Bar+2',
      'https://dummyimage.com/800x600/6B9FFF/FFFFFF.png&text=Bar+3'
    ],
    seller: admin._id
  });

  await Product.create({
    title: 'DJ Equipment Package',
    description: 'Professional DJ setup with turntables, mixer, speakers, and lighting effects. Everything needed for an amazing party experience.',
    price: 0,
    stock: 50,
    minimumStock: 1,
    lowStockThreshold: 2,
    isRental: true,
    rental: { pricePerDay: 800, deposit: 2000 },
    category: 'Audio',
    image: 'https://dummyimage.com/800x600/4169E1/FFFFFF.png&text=DJ+Equipment',
    images: [
      'https://dummyimage.com/800x600/4169E1/FFFFFF.png&text=DJ+1',
      'https://dummyimage.com/800x600/1E3A8A/FFFFFF.png&text=DJ+2',
      'https://dummyimage.com/800x600/6B9FFF/FFFFFF.png&text=DJ+3'
    ],
    seller: admin._id
  });

  await Product.create({
    title: 'Luxury Table Settings',
    description: 'Complete luxury table setting package with fine china, crystal glassware, and premium silverware. Elevates any dining experience.',
    price: 0,
    stock: 325,
    minimumStock: 10,
    lowStockThreshold: 20,
    isRental: true,
    rental: { pricePerDay: 12, deposit: 25 },
    category: 'Tableware',
    image: 'https://dummyimage.com/800x600/4169E1/FFFFFF.png&text=Table+Settings',
    images: [
      'https://dummyimage.com/800x600/4169E1/FFFFFF.png&text=Tableware+1',
      'https://dummyimage.com/800x600/1E3A8A/FFFFFF.png&text=Tableware+2',
      'https://dummyimage.com/800x600/6B9FFF/FFFFFF.png&text=Tableware+3'
    ],
    seller: admin._id
  });

  await Product.create({
    title: 'Outdoor Tent - Premium',
    description: 'High-quality weatherproof tent with sidewalls and flooring. Perfect for outdoor events, weddings, and garden parties. Various sizes available.',
    price: 0,
    stock: 55,
    minimumStock: 1,
    lowStockThreshold: 2,
    isRental: true,
    rental: { pricePerDay: 600, deposit: 1500 },
    category: 'Staging',
    image: 'https://dummyimage.com/800x600/4169E1/FFFFFF.png&text=Outdoor+Tent',
    images: [
      'https://dummyimage.com/800x600/4169E1/FFFFFF.png&text=Tent+1',
      'https://dummyimage.com/800x600/1E3A8A/FFFFFF.png&text=Tent+2',
      'https://dummyimage.com/800x600/6B9FFF/FFFFFF.png&text=Tent+3'
    ],
    seller: admin._id
  });

  await Product.create({
    title: 'Smoke Machine & Effects',
    description: 'Professional smoke machine with various effect options. Creates dramatic atmosphere for performances, parties, and special events.',
    price: 0,
    stock: 65,
    minimumStock: 2,
    lowStockThreshold: 3,
    isRental: true,
    rental: { pricePerDay: 180, deposit: 400 },
    category: 'Effects',
    image: 'https://dummyimage.com/800x600/4169E1/FFFFFF.png&text=Smoke+Machine',
    images: [
      'https://dummyimage.com/800x600/4169E1/FFFFFF.png&text=Smoke+1',
      'https://dummyimage.com/800x600/1E3A8A/FFFFFF.png&text=Smoke+2',
      'https://dummyimage.com/800x600/6B9FFF/FFFFFF.png&text=Smoke+3'
    ],
    seller: admin._id
  });

  await Product.create({
    title: 'Premium Backdrop Collection',
    description: 'Collection of premium backdrops in various styles - floral, geometric, and custom designs. Perfect for photo booths and event photography.',
    price: 0,
    stock: 105,
    minimumStock: 3,
    lowStockThreshold: 5,
    isRental: true,
    rental: { pricePerDay: 120, deposit: 250 },
    category: 'Decor',
    image: 'https://dummyimage.com/800x600/4169E1/FFFFFF.png&text=Backdrop+Collection',
    images: [
      'https://dummyimage.com/800x600/4169E1/FFFFFF.png&text=Backdrop+1',
      'https://dummyimage.com/800x600/1E3A8A/FFFFFF.png&text=Backdrop+2',
      'https://dummyimage.com/800x600/6B9FFF/FFFFFF.png&text=Backdrop+3'
    ],
    seller: admin._id
  });

  console.log('Seeded with luxury event production products');
  process.exit(0);
};
run();
