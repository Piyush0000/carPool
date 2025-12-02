// Production configuration settings
// Parse allowed origins from environment variable
const allowedOriginsStr = process.env.ALLOWED_ORIGINS || 'https://car-pool-flax.vercel.app';
const allowedOrigins = allowedOriginsStr.split(',').map(origin => origin.trim());

export const productionConfig = {
  // MongoDB configuration
  mongodb: {
    uri: process.env.MONGODB_URI_PROD || process.env.MONGODB_URI || 'mongodb+srv://piyushrathore:piyushcodes@cluster0.wiqfcjk.mongodb.net/carpoolgrp?retryWrites=true&w=majority&appName=Cluster0',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // Add production-specific options
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    }
  },
  
  // Security settings
  security: {
    jwt: {
      secret: process.env.JWT_SECRET || 'fallback_jwt_secret_for_dev_only',
      expiresIn: process.env.JWT_EXPIRE || '7d'
    },
    cors: {
      origin: allowedOrigins,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH']
    },
    rateLimit: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100 // limit each IP to 100 requests per windowMs
    }
  },
  
  // Server settings
  server: {
    port: parseInt(process.env.PORT || '5000', 10),
    environment: process.env.NODE_ENV || 'production'
  },
  
  // External services
  services: {
    googleMaps: {
      apiKey: process.env.GOOGLE_MAPS_API_KEY || ''
    },
    geoapify: {
      apiKey: process.env.GEOAPIFY_API_KEY || ''
    },
    email: {
      service: process.env.EMAIL_SERVICE || 'gmail',
      username: process.env.EMAIL_USERNAME || '',
      password: process.env.EMAIL_PASSWORD || ''
    },
    payment: {
      stripe: {
        secretKey: process.env.STRIPE_SECRET_KEY || '',
        publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || ''
      }
    }
  }
};

export default productionConfig;