// backend/src/server.ts
import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import http from 'http';
import { Server } from 'socket.io';

// Load environment variables
dotenv.config();

// Import routes
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import poolRoutes from './routes/pool.routes';
import groupRoutes from './routes/group.routes';
import adminRoutes from './routes/admin.routes';
import chatRoutes from './routes/chat.routes';
import locationRoutes from './routes/location.routes';
import notificationRoutes from './routes/notification.routes';
import geoapifyRoutes from './routes/geoapify.routes';

// **FIXED: Define allowed origins properly - Add ALL needed origins**
const allowedOrigins = [
  'http://localhost:5173',  // Local development (Vite)
  'http://localhost:3000',  // Local development (React)
  'https://car-pool-flax.vercel.app',  // Your Vercel app
  'https://carpool-2-omli.onrender.com',  // Your Render backend (for WebSocket)
];

// Initialize app
const app = express();
const server = http.createServer(app);

// **FIXED: Simplify Socket.io CORS configuration**
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
  },
  pingTimeout: 60000,
  pingInterval: 25000
});

// Make io accessible to routes
app.set('io', io);

// **FIXED: Update Helmet configuration to fix Cross-Origin-Opener-Policy warnings**
app.use(helmet({
  crossOriginOpenerPolicy: false, // Disable COOP to fix window.closed warnings
  crossOriginResourcePolicy: { policy: "cross-origin" },
  crossOriginEmbedderPolicy: false, // Disable COEP for better compatibility
  contentSecurityPolicy: false // Disable CSP for now, can configure later
}));

// **FIXED: Simplify CORS configuration - Direct array approach**
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  optionsSuccessStatus: 200,
  maxAge: 86400 // 24 hours for preflight cache
}));

// **ADDED: Manual CORS headers middleware for better control**
app.use((req: Request, res: Response, next: NextFunction) => {
  const origin = req.headers.origin;
  
  // Set CORS headers dynamically
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// MongoDB connection
const connectDB = async (): Promise<void> => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/carpool';
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    if (mongoose.connection.db) {
      console.log(`📊 Database: ${mongoose.connection.db.databaseName}`);
    }
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Connect to database
connectDB();

// Log all incoming requests for debugging
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl} - Origin: ${req.headers.origin}`);
  next();
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/pool', poolRoutes);
app.use('/api/group', groupRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/location', locationRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/geoapify', geoapifyRoutes);

// Health check endpoint with detailed CORS info
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Server is running healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    uptime: process.uptime(),
    cors: {
      allowedOrigins: allowedOrigins,
      requestOrigin: req.headers.origin || 'none',
      isOriginAllowed: req.headers.origin ? allowedOrigins.includes(req.headers.origin) : true
    },
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      pool: '/api/pool',
      group: '/api/group',
      chat: '/api/chat',
      location: '/api/location',
      notifications: '/api/notifications',
      geoapify: '/api/geoapify',
      admin: '/api/admin'
    }
  });
});

// Test CORS endpoint
app.get('/api/test-cors', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'CORS test successful',
    origin: req.headers.origin,
    headers: req.headers,
    corsHeaders: {
      'Access-Control-Allow-Origin': req.headers.origin,
      'Access-Control-Allow-Credentials': 'true'
    }
  });
});

// Root endpoint
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Campus Cab Pool API Server',
    version: '1.0.0',
    status: 'running',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      pools: '/api/pool',
      groups: '/api/group',
      chat: '/api/chat',
      notifications: '/api/notifications',
      geoapify: '/api/geoapify',
      admin: '/api/admin',
      health: '/api/health',
      testCors: '/api/test-cors'
    },
    cors: {
      allowedOrigins: allowedOrigins,
      currentOrigin: req.headers.origin
    }
  });
});

// Socket.io connection handling with enhanced features
const userSockets = new Map<string, string>(); // userId -> socketId mapping

io.on('connection', (socket) => {
  console.log('🔌 User connected:', socket.id, 'Origin:', socket.handshake.headers.origin);

  // User authentication and registration
  socket.on('register_user', (userId: string) => {
    userSockets.set(userId, socket.id);
    socket.join(`user_${userId}`);
    console.log(`👤 User ${userId} registered with socket ${socket.id}`);
  });

  // Join room for group chat
  socket.on('join_room', (roomId: string) => {
    socket.join(roomId);
    console.log(`👥 User ${socket.id} joined room ${roomId}`);
    
    // Notify others in the room
    socket.to(roomId).emit('user_joined', {
      socketId: socket.id,
      timestamp: new Date()
    });
  });

  // Leave room
  socket.on('leave_room', (roomId: string) => {
    socket.leave(roomId);
    console.log(`👋 User ${socket.id} left room ${roomId}`);
    
    // Notify others in the room
    socket.to(roomId).emit('user_left', {
      socketId: socket.id,
      timestamp: new Date()
    });
  });

  // Handle chat messages
  socket.on('send_message', (data: { roomId: string; message: any }) => {
    socket.to(data.roomId).emit('receive_message', data.message);
    console.log(`💬 Message sent to room ${data.roomId}`);
  });

  // Handle typing indicators
  socket.on('typing', (data: { roomId: string; userId: string; userName: string }) => {
    socket.to(data.roomId).emit('user_typing', {
      userId: data.userId,
      userName: data.userName
    });
  });

  socket.on('stop_typing', (data: { roomId: string; userId: string }) => {
    socket.to(data.roomId).emit('user_stop_typing', {
      userId: data.userId
    });
  });

  // Handle ride updates
  socket.on('ride_update', (data: { rideId: string; update: any }) => {
    socket.to(data.rideId).emit('ride_updated', data.update);
    console.log(`🚗 Ride update for ${data.rideId}`);
  });

  // Handle user location updates
  socket.on('location_update', (data: { userId: string; location: any; groupId?: string }) => {
    if (data.groupId) {
      // Send to specific group
      socket.to(`group_${data.groupId}`).emit('user_location_updated', data);
    } else {
      // Broadcast to all
      socket.broadcast.emit('user_location_updated', data);
    }
  });

  // Handle notifications
  socket.on('send_notification', (data: { userId: string; notification: any }) => {
    const targetSocketId = userSockets.get(data.userId);
    if (targetSocketId) {
      io.to(targetSocketId).emit('new_notification', data.notification);
      console.log(`🔔 Notification sent to user ${data.userId}`);
    }
  });

  // Handle pool match notifications
  socket.on('pool_matched', (data: { userIds: string[]; poolData: any }) => {
    data.userIds.forEach(userId => {
      const socketId = userSockets.get(userId);
      if (socketId) {
        io.to(socketId).emit('match_found', data.poolData);
      }
    });
    console.log(`🎯 Pool match notification sent to ${data.userIds.length} users`);
  });

  // Handle group invitations
  socket.on('group_invitation', (data: { userId: string; groupData: any }) => {
    const socketId = userSockets.get(data.userId);
    if (socketId) {
      io.to(socketId).emit('group_invite', data.groupData);
      console.log(`📧 Group invitation sent to user ${data.userId}`);
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('❌ User disconnected:', socket.id);
    
    // Remove from userSockets map
    for (const [userId, socketId] of userSockets.entries()) {
      if (socketId === socket.id) {
        userSockets.delete(userId);
        console.log(`🗑️ Removed user ${userId} from active users`);
        break;
      }
    }
  });

  // Handle errors
  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });
});

// Export io for use in controllers
export { io };

// Centralized error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('🚨 Error Stack:', err.stack);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((e: any) => e.message);
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors
    });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({
      success: false,
      message: `${field} already exists`
    });
  }

  // Mongoose CastError (invalid ObjectId)
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'Invalid ID format'
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expired'
    });
  }

  // Default error
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  return res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 404 handler
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found on this server`,
    cors: {
      allowedOrigins: allowedOrigins,
      yourOrigin: req.headers.origin
    }
  });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error) => {
  console.log('🚨 Unhandled Rejection:', err.name, err.message);
  console.log('💥 Shutting down server...');
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err: Error) => {
  console.log('🚨 Uncaught Exception:', err.name, err.message);
  console.log('💥 Shutting down server...');
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received');
  server.close(() => {
    console.log('💤 Process terminated');
    mongoose.connection.close();
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`
🚀 Server running in ${process.env.NODE_ENV || 'development'} mode
📍 Port: ${PORT}
🌐 URL: http://localhost:${PORT}
📚 API Docs: http://localhost:${PORT}/api/health
🔌 WebSocket: ws://localhost:${PORT}
🌍 Allowed Origins: ${allowedOrigins.join(', ')}
📊 MongoDB: ${mongoose.connection.readyState === 1 ? '✅ Connected' : '❌ Disconnected'}
  `);
});

export { app };