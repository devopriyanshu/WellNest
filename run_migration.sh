#!/bin/bash

# Database Migration Execution Script
# This script runs the RBAC migration safely

set -e  # Exit on error

echo "🔄 Starting WellNest Database Migration..."
echo "Migration: Add RBAC fields and tables"
echo "Date: $(date)"
echo ""

# Load environment variables
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "❌ ERROR: DATABASE_URL not set in environment"
    exit 1
fi

echo "✅ Database URL found"
echo ""

# Optional: Create backup (commented out for Neon DB - use Neon dashboard for backups)
# echo "📦 Creating database backup..."
# BACKUP_FILE="backup_$(date +%Y%m%d_%H%M%S).sql"
# pg_dump "$DATABASE_URL" > "$BACKUP_FILE"
# echo "✅ Backup created: $BACKUP_FILE"
# echo ""

echo "🚀 Running migration SQL..."
psql "$DATABASE_URL" -f prisma/migrations/001_add_rbac_fields.sql

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Migration completed successfully!"
    echo ""
    echo "📋 Summary of changes:"
    echo "  - Added columns to central_users: google_id, is_verified, is_active, last_login"
    echo "  - Added columns to experts: is_approved, is_verified, rating, total_reviews"
    echo "  - Added columns to centers: is_approved, is_verified, rating, total_reviews"
    echo "  - Created new tables: refresh_tokens, admins, reviews, audit_logs"
    echo "  - Added performance indexes"
    echo ""
    echo "🎯 Next steps:"
    echo "  1. Run: npx prisma generate"
    echo "  2. Update controllers to use Prisma"
    echo "  3. Test the application"
else
    echo ""
    echo "❌ Migration failed!"
    echo "Please check the error messages above"
    exit 1
fi
