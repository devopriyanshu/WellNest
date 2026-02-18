import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import session from "express-session";
import passport from "./config/passportConfig.js";
import pool from "./config/neondb.js";
import logger from "./utils/logger.js";
import { helmetConfig, rateLimiters, corsConfig } from "./config/security.js";
import { errorHandler } from "./middleware/errorHandler.js";

// Routes
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import expertRoutes from "./routes/expertRoutes.js";
import centerRoutes from "./routes/centerRoutes.js";
import logRoutes from "./routes/logRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import centralUserRoutes from "./routes/centralUserRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

const app = express();

// Enable trust proxy for Nginx/Load Balancer
app.set('trust proxy', 1);

// Security middleware
app.use(helmetConfig);
app.use(cors(corsConfig));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Session setup with proper configuration
app.use(
  session({ 
    secret: process.env.SESSION_SECRET || 'fallback-secret-change-in-production',
    resave: false, 
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development'
    });
  } catch (error) {
    logger.error('Health check failed', { error: error.message });
    res.status(503).json({
      status: 'unhealthy',
      error: error.message,
    });
  }
});

// Rate limiting
app.use('/api/', rateLimiters.global);
app.use('/auth/login', rateLimiters.auth);
app.use('/auth/signup', rateLimiters.auth);

// API routes (v1)
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/experts', expertRoutes);
app.use('/api/v1/centers', centerRoutes);
app.use('/api/v1/appointments', appointmentRoutes);
app.use('/api/v1/logs', logRoutes);
app.use('/api/v1/user', centralUserRoutes);
app.use('/api/v1/admin', adminRoutes);

// Legacy routes (for backward compatibility - will be deprecated)
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/experts', expertRoutes);
app.use('/centers', centerRoutes);
app.use('/appointments', appointmentRoutes);
app.use('/logs', logRoutes);

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    message: "WellNest API Server",
    version: "1.0.0",
    status: "running",
    endpoints: {
      health: "/health",
      api: "/api/v1"
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl
  });
});

// Error handler (must be last)
app.use(errorHandler);

// Database connection
pool
  .connect()
  .then(() => {
    logger.info("Connected to PostgreSQL database!");
  })
  .catch((err) => {
    logger.error("Error connecting to the database:", { error: err.message });
  });

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully');
  await pool.end();
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received, shutting down gracefully');
  await pool.end();
  process.exit(0);
});

export default app;
