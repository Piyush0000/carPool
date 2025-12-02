"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = exports.io = void 0;
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const config_1 = __importDefault(require("./config"));
dotenv_1.default.config();
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const pool_routes_1 = __importDefault(require("./routes/pool.routes"));
const group_routes_1 = __importDefault(require("./routes/group.routes"));
const admin_routes_1 = __importDefault(require("./routes/admin.routes"));
const chat_routes_1 = __importDefault(require("./routes/chat.routes"));
const location_routes_1 = __importDefault(require("./routes/location.routes"));
const notification_routes_1 = __importDefault(require("./routes/notification.routes"));
const geoapify_routes_1 = __importDefault(require("./routes/geoapify.routes"));
const app = (0, express_1.default)();
exports.app = app;
const server = http_1.default.createServer(app);
const allowedOrigins = Array.isArray(config_1.default.security.cors.origin)
    ? config_1.default.security.cors.origin
    : [config_1.default.security.cors.origin];
console.log('Allowed CORS Origins:', allowedOrigins);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: (origin, callback) => {
            if (!origin)
                return callback(null, true);
            if (allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
                callback(null, true);
            }
            else {
                console.warn(`Blocked CORS request from origin: ${origin}`);
                callback(new Error('Not allowed by CORS'));
            }
        },
        methods: config_1.default.security.cors.methods,
        credentials: config_1.default.security.cors.credentials,
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
    },
    pingTimeout: 60000,
    pingInterval: 25000
});
exports.io = io;
app.set('io', io);
app.set('trust proxy', 1);
app.use((0, helmet_1.default)({
    crossOriginOpenerPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginEmbedderPolicy: false
}));
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if (!origin)
            return callback(null, true);
        if (allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
            callback(null, true);
        }
        else {
            console.warn(`Blocked CORS request from origin: ${origin}`);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: config_1.default.security.cors.credentials,
    methods: config_1.default.security.cors.methods,
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    maxAge: 600
}));
app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (origin && (allowedOrigins.includes(origin) || allowedOrigins.includes('*'))) {
        res.setHeader('Access-Control-Allow-Origin', origin);
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
        res.setHeader('Access-Control-Expose-Headers', 'Content-Range, X-Content-Range');
    }
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    next();
});
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
const connectDB = async () => {
    try {
        await mongoose_1.default.connect(config_1.default.mongodb.uri);
        console.log('✅ Connected to MongoDB');
        if (mongoose_1.default.connection.db) {
            console.log(`📊 Database: ${mongoose_1.default.connection.db.databaseName}`);
        }
    }
    catch (error) {
        console.error('❌ MongoDB connection error:', error);
        process.exit(1);
    }
};
connectDB();
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl} - Origin: ${req.headers.origin || 'none'}`);
    next();
});
app.use('/api/auth', auth_routes_1.default);
app.use('/api/users', user_routes_1.default);
app.use('/api/pool', pool_routes_1.default);
app.use('/api/group', group_routes_1.default);
app.use('/api/admin', admin_routes_1.default);
app.use('/api/chat', chat_routes_1.default);
app.use('/api/location', location_routes_1.default);
app.use('/api/notifications', notification_routes_1.default);
app.use('/api/geoapify', geoapify_routes_1.default);
app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Server is running healthy',
        timestamp: new Date().toISOString(),
        environment: config_1.default.server.environment,
        database: mongoose_1.default.connection.readyState === 1 ? 'connected' : 'disconnected',
        uptime: process.uptime(),
        cors: {
            allowedOrigins: allowedOrigins,
            requestOrigin: req.headers.origin || 'none'
        }
    });
});
app.get('/api/test-cors', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'CORS test successful',
        origin: req.headers.origin
    });
});
app.get('/', (req, res) => {
    res.json({
        message: 'Campus Cab Pool API Server',
        version: '1.0.0',
        status: 'running',
        environment: config_1.default.server.environment,
        timestamp: new Date().toISOString()
    });
});
const userSockets = new Map();
io.on('connection', (socket) => {
    console.log('🔌 User connected:', socket.id);
    socket.on('register_user', (userId) => {
        userSockets.set(userId, socket.id);
        socket.join(`user_${userId}`);
        console.log(`👤 User ${userId} registered with socket ${socket.id}`);
    });
    socket.on('join_room', (roomId) => {
        socket.join(roomId);
        console.log(`👥 User ${socket.id} joined room ${roomId}`);
        socket.to(roomId).emit('user_joined', {
            socketId: socket.id,
            timestamp: new Date()
        });
    });
    socket.on('leave_room', (roomId) => {
        socket.leave(roomId);
        console.log(`👋 User ${socket.id} left room ${roomId}`);
        socket.to(roomId).emit('user_left', {
            socketId: socket.id,
            timestamp: new Date()
        });
    });
    socket.on('send_message', (data) => {
        socket.to(data.roomId).emit('receive_message', data.message);
        console.log(`💬 Message sent to room ${data.roomId}`);
    });
    socket.on('typing', (data) => {
        socket.to(data.roomId).emit('user_typing', {
            userId: data.userId,
            userName: data.userName
        });
    });
    socket.on('stop_typing', (data) => {
        socket.to(data.roomId).emit('user_stop_typing', {
            userId: data.userId
        });
    });
    socket.on('ride_update', (data) => {
        socket.to(data.rideId).emit('ride_updated', data.update);
        console.log(`🚗 Ride update for ${data.rideId}`);
    });
    socket.on('location_update', (data) => {
        if (data.groupId) {
            socket.to(`group_${data.groupId}`).emit('user_location_updated', data);
        }
        else {
            socket.broadcast.emit('user_location_updated', data);
        }
    });
    socket.on('send_notification', (data) => {
        const targetSocketId = userSockets.get(data.userId);
        if (targetSocketId) {
            io.to(targetSocketId).emit('new_notification', data.notification);
            console.log(`🔔 Notification sent to user ${data.userId}`);
        }
    });
    socket.on('pool_matched', (data) => {
        data.userIds.forEach(userId => {
            const socketId = userSockets.get(userId);
            if (socketId) {
                io.to(socketId).emit('match_found', data.poolData);
            }
        });
        console.log(`🎯 Pool match notification sent to ${data.userIds.length} users`);
    });
    socket.on('group_invitation', (data) => {
        const socketId = userSockets.get(data.userId);
        if (socketId) {
            io.to(socketId).emit('group_invite', data.groupData);
            console.log(`📧 Group invitation sent to user ${data.userId}`);
        }
    });
    socket.on('disconnect', () => {
        console.log('❌ User disconnected:', socket.id);
        for (const [userId, socketId] of userSockets.entries()) {
            if (socketId === socket.id) {
                userSockets.delete(userId);
                console.log(`🗑️ Removed user ${userId} from active users`);
                break;
            }
        }
    });
    socket.on('error', (error) => {
        console.error('Socket error:', error);
    });
});
app.use((err, req, res, next) => {
    console.error('🚨 Error Stack:', err.stack);
    if (err.name === 'ValidationError') {
        const errors = Object.values(err.errors).map((e) => e.message);
        return res.status(400).json({
            success: false,
            message: 'Validation Error',
            errors
        });
    }
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        return res.status(400).json({
            success: false,
            message: `${field} already exists`
        });
    }
    if (err.name === 'CastError') {
        return res.status(400).json({
            success: false,
            message: 'Invalid ID format'
        });
    }
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
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    return res.status(statusCode).json({
        success: false,
        message,
        ...(config_1.default.server.environment === 'development' && { stack: err.stack })
    });
});
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.method} ${req.originalUrl} not found on this server`
    });
});
process.on('unhandledRejection', (err) => {
    console.log('🚨 Unhandled Rejection:', err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});
process.on('uncaughtException', (err) => {
    console.log('🚨 Uncaught Exception:', err.name, err.message);
    process.exit(1);
});
process.on('SIGTERM', () => {
    console.log('👋 SIGTERM received');
    server.close(() => {
        console.log('💤 Process terminated');
        mongoose_1.default.connection.close();
    });
});
const PORT = config_1.default.server.port;
server.listen(PORT, () => {
    console.log(`
🚀 Server running in ${config_1.default.server.environment} mode
📍 Port: ${PORT}
🌐 URL: http://localhost:${PORT}
📚 API Docs: http://localhost:${PORT}/api/health
🔌 WebSocket: ws://localhost:${PORT}
🌍 Allowed Origins: ${JSON.stringify(allowedOrigins)}
📊 MongoDB: ${mongoose_1.default.connection.readyState === 1 ? '✅ Connected' : '❌ Disconnected'}
  `);
});
//# sourceMappingURL=server.js.map