import logger from '../utils/logger.js';

export const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  error.statusCode = err.statusCode || 500;

  // Log error
  logger.error({
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    user: req.user?.email || 'anonymous',
  });

  // Mongoose/Prisma duplicate key error
  if (err.code === 'P2002' || err.code === 11000) {
    error.message = 'Duplicate field value entered';
    error.statusCode = 400;
  }

  // Prisma record not found
  if (err.code === 'P2025') {
    error.message = 'Record not found';
    error.statusCode = 404;
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error.message = 'Invalid token';
    error.statusCode = 401;
  }

  if (err.name === 'TokenExpiredError') {
    error.message = 'Token expired';
    error.statusCode = 401;
  }

  // Zod validation errors
  if (err.name === 'ZodError') {
    error.message = 'Validation failed';
    error.statusCode = 400;
  }

  const statusCode = error.statusCode || 500;
  const message = err.isOperational 
    ? error.message 
    : 'Internal server error';

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { 
      stack: err.stack,
      error: err 
    }),
  });
};

// Async handler to wrap async route handlers
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
