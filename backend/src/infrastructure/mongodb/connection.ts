// MongoDB Connection

import mongoose from 'mongoose';
import { config } from '../../config/index.js';

export async function connectToMongoDB(): Promise<void> {
  try {
    await mongoose.connect(config.MONGODB_URI, {
      dbName: config.MONGODB_DB_NAME,
    });
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
}

export async function disconnectFromMongoDB(): Promise<void> {
  await mongoose.disconnect();
  console.log('Disconnected from MongoDB');
}
