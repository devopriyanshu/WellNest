import dotenv from 'dotenv';
// Load environment variables FIRST
dotenv.config();

import { PrismaClient } from '@prisma/client';
import logger from '../utils/logger.js';

// Get database URL from environment
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL environment variable is not set');
}

logger.info(`Connecting to database: ${databaseUrl.replace(/:[^:@]+@/, ':****@')}`);

// Create Prisma client (Prisma v5 - no adapter needed)
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: databaseUrl,
    },
  },
  log: [
    { level: 'query', emit: 'event' },
    { level: 'error', emit: 'stdout' },
    { level: 'warn', emit: 'stdout' },
  ],
});

// Log queries in development


// Test connection
prisma.$connect()
  .then(() => {
    logger.info('Prisma client connected successfully');
  })
  .catch((err) => {
    logger.error('Prisma connection failed:', err);
  });

// Graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
  logger.info('Prisma client disconnected');
});

export default prisma;
