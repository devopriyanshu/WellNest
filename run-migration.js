import dotenv from 'dotenv';
dotenv.config();

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from './config/neondb.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigration() {
  console.log('🔄 Starting WellNest Database Migration...');
  console.log('Migration: Add RBAC fields and tables');
  console.log('Date:', new Date().toISOString());
  console.log('');

  try {
    // Read migration SQL file
    const migrationPath = path.join(__dirname, 'prisma/migrations/001_add_rbac_fields.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

    console.log('📄 Migration SQL loaded');
    console.log('');

    // Connect to database
    const client = await pool.connect();
    console.log('✅ Connected to database');
    console.log('');

    try {
      // Start transaction
      await client.query('BEGIN');
      console.log('🔒 Transaction started');
      console.log('');

      // Execute migration SQL
      console.log('🚀 Running migration...');
      await client.query(migrationSQL);

      // Commit transaction
      await client.query('COMMIT');
      console.log('✅ Transaction committed');
      console.log('');

      console.log('✅ Migration completed successfully!');
      console.log('');
      console.log('📋 Summary of changes:');
      console.log('  ✓ Added columns to central_users: google_id, is_verified, is_active, last_login');
      console.log('  ✓ Added columns to experts: is_approved, is_verified, rating, total_reviews');
      console.log('  ✓ Added columns to centers: is_approved, is_verified, rating, total_reviews');
      console.log('  ✓ Created new tables: refresh_tokens, admins, reviews, audit_logs');
      console.log('  ✓ Added performance indexes');
      console.log('');
      console.log('🎯 Next steps:');
      console.log('  1. Update controllers to use Prisma');
      console.log('  2. Test the application');
      console.log('');

    } catch (error) {
      // Rollback on error
      await client.query('ROLLBACK');
      console.error('❌ Migration failed, transaction rolled back');
      throw error;
    } finally {
      client.release();
    }

  } catch (error) {
    console.error('❌ Migration error:', error.message);
    console.error('');
    console.error('Stack trace:', error.stack);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run migration
runMigration();
