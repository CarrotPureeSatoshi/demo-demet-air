// Configuration centralisée

import dotenv from 'dotenv';

dotenv.config();

export const config = {
  // Server
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '4001', 10),
  HOST: process.env.HOST || '0.0.0.0',

  // MongoDB
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27018/demo-demet-air',
  MONGODB_DB_NAME: process.env.MONGODB_DB_NAME || 'demo-demet-air',

  // JWT
  JWT_SECRET: process.env.JWT_SECRET || 'change-me-in-production',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',

  // CORS
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5201',

  // OpenRouter API (pour analyse et génération d'images)
  OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY || '',

  // HubSpot
  HUBSPOT_PORTAL_ID: process.env.HUBSPOT_PORTAL_ID || '144452458',
  HUBSPOT_FORM_ID: process.env.HUBSPOT_FORM_ID || '3db0b61d-feba-400e-be7a-039cf1d4420b',
  HUBSPOT_REGION: process.env.HUBSPOT_REGION || 'eu1',

  // Storage (AWS S3 or compatible)
  AWS_REGION: process.env.AWS_REGION || 'us-east-1',
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID || '',
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY || '',
  AWS_S3_BUCKET: process.env.AWS_S3_BUCKET || 'demo-demet-air-uploads',

  // Or use local storage for dev
  STORAGE_TYPE: process.env.STORAGE_TYPE || 'local', // 'local' or 's3'
  LOCAL_STORAGE_PATH: process.env.LOCAL_STORAGE_PATH || './uploads',

  // Calendly
  CALENDLY_URL: process.env.CALENDLY_URL || 'https://calendly.com/demetair/rdv-gratuit',

  // Upload limits
  MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE || '10485760', 10), // 10MB
  ALLOWED_IMAGE_FORMATS: ['image/jpeg', 'image/png', 'image/jpg'],

  // Rate limiting
  RATE_LIMIT_MAX: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
  RATE_LIMIT_WINDOW: process.env.RATE_LIMIT_WINDOW || '15 minutes',

  // Image processing
  IMAGE_COMPRESSION_THRESHOLD: parseInt(process.env.IMAGE_COMPRESSION_THRESHOLD || '5242880', 10), // 5MB
  IMAGE_COMPRESSION_QUALITY: parseInt(process.env.IMAGE_COMPRESSION_QUALITY || '85', 10),

  // Generation timeout
  AI_GENERATION_TIMEOUT: parseInt(process.env.AI_GENERATION_TIMEOUT || '60000', 10), // 60s
};
