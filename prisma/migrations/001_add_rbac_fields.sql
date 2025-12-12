-- Migration: Add RBAC fields and new tables
-- This migration is designed to be NON-BREAKING and backward compatible

-- ============================================
-- PHASE 1: Extend CentralUser
-- ============================================

-- Add new columns to central_users (if they don't exist)
ALTER TABLE central_users 
  ADD COLUMN IF NOT EXISTS google_id VARCHAR(255) UNIQUE,
  ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS last_login TIMESTAMP;

-- Migrate existing status to is_active
UPDATE central_users 
SET is_active = (status = 'active')
WHERE is_active IS NULL OR is_active != (status = 'active');

-- ============================================
-- PHASE 2: Extend Expert
-- ============================================

ALTER TABLE experts
  ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS rating DECIMAL(3,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS total_reviews INTEGER DEFAULT 0;

-- Migrate status to is_approved
UPDATE experts 
SET is_approved = (status = 'approved')
WHERE is_approved IS NULL OR is_approved != (status = 'approved');

-- Create index on new columns
CREATE INDEX IF NOT EXISTS idx_experts_is_approved ON experts(is_approved);
CREATE INDEX IF NOT EXISTS idx_experts_rating ON experts(rating);

-- ============================================
-- PHASE 3: Extend Center
-- ============================================

ALTER TABLE centers
  ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS rating DECIMAL(3,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS total_reviews INTEGER DEFAULT 0;

-- Migrate status to is_approved
UPDATE centers 
SET is_approved = (status = 'approved')
WHERE is_approved IS NULL OR is_approved != (status = 'approved');

-- Create index on new columns
CREATE INDEX IF NOT EXISTS idx_centers_is_approved ON centers(is_approved);
CREATE INDEX IF NOT EXISTS idx_centers_rating ON centers(rating);

-- ============================================
-- PHASE 4: Create New Tables
-- ============================================

-- Refresh Tokens Table
CREATE TABLE IF NOT EXISTS refresh_tokens (
  id SERIAL PRIMARY KEY,
  token VARCHAR(500) UNIQUE NOT NULL,
  central_user_id INTEGER NOT NULL REFERENCES central_users(id) ON DELETE CASCADE,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user ON refresh_tokens(central_user_id);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_token ON refresh_tokens(token);

-- Admins Table
CREATE TABLE IF NOT EXISTS admins (
  id SERIAL PRIMARY KEY,
  central_user_id INTEGER UNIQUE NOT NULL REFERENCES central_users(id) ON DELETE CASCADE,
  full_name VARCHAR(255) NOT NULL,
  phone_number VARCHAR(20),
  department VARCHAR(100),
  permissions TEXT[],
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_admins_central_user ON admins(central_user_id);

-- Reviews Table
CREATE TABLE IF NOT EXISTS reviews (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expert_id INTEGER NOT NULL REFERENCES experts(id) ON DELETE CASCADE,
  appointment_id INTEGER UNIQUE REFERENCES appointments(id) ON DELETE CASCADE,
  rating SMALLINT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  response_text TEXT,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reviews_user ON reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_expert ON reviews(expert_id);
CREATE INDEX IF NOT EXISTS idx_reviews_appointment ON reviews(appointment_id);

-- Audit Logs Table
CREATE TABLE IF NOT EXISTS audit_logs (
  id SERIAL PRIMARY KEY,
  central_user_id INTEGER NOT NULL REFERENCES central_users(id) ON DELETE CASCADE,
  action VARCHAR(100) NOT NULL,
  resource VARCHAR(100) NOT NULL,
  resource_id INTEGER,
  ip_address VARCHAR(45),
  user_agent TEXT,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(central_user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON audit_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_audit_logs_resource ON audit_logs(resource, resource_id);

-- ============================================
-- PHASE 5: Add Missing Indexes for Performance
-- ============================================

-- User indexes
CREATE INDEX IF NOT EXISTS idx_users_user_id ON users(user_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Expert indexes
CREATE INDEX IF NOT EXISTS idx_experts_user_id ON experts(user_id);
CREATE INDEX IF NOT EXISTS idx_experts_status ON experts(status);

-- Center indexes
CREATE INDEX IF NOT EXISTS idx_centers_user_id ON centers(user_id);
CREATE INDEX IF NOT EXISTS idx_centers_status ON centers(status);

-- Appointment indexes
CREATE INDEX IF NOT EXISTS idx_appointments_user_id ON appointments(user_id);
CREATE INDEX IF NOT EXISTS idx_appointments_expert_id ON appointments(expert_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);

-- Health log indexes
CREATE INDEX IF NOT EXISTS idx_sleep_logs_user_date ON sleep_logs(user_id, date);
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_date ON activity_logs(user_id, date);
CREATE INDEX IF NOT EXISTS idx_meal_logs_user_date ON meal_logs(user_id, date);

-- Mental health indexes
CREATE INDEX IF NOT EXISTS idx_mood_logs_user ON mood_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_stress_logs_user ON stress_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_mental_health_user ON mental_health_assessments(user_id);

-- Payment indexes
CREATE INDEX IF NOT EXISTS idx_payments_user ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_expert ON payments(expert_id);

-- Expert supporting table indexes
CREATE INDEX IF NOT EXISTS idx_expert_availability_expert ON expert_availability(expert_id);
CREATE INDEX IF NOT EXISTS idx_expert_faqs_expert ON expert_faqs(expert_id);
CREATE INDEX IF NOT EXISTS idx_expert_qualifications_expert ON expert_qualifications(expert_id);
CREATE INDEX IF NOT EXISTS idx_expert_services_expert ON expert_services(expert_id);
CREATE INDEX IF NOT EXISTS idx_expert_specialties_expert ON expert_specialties(expert_id);

-- Center supporting table indexes
CREATE INDEX IF NOT EXISTS idx_center_addresses_center ON center_addresses(center_id);
CREATE INDEX IF NOT EXISTS idx_center_amenities_center ON center_amenities(center_id);
CREATE INDEX IF NOT EXISTS idx_center_classes_center ON center_classes(center_id);
CREATE INDEX IF NOT EXISTS idx_center_equipment_center ON center_equipment(center_id);
CREATE INDEX IF NOT EXISTS idx_center_faqs_center ON center_faqs(expert_id);
CREATE INDEX IF NOT EXISTS idx_center_images_center ON center_images(center_id);
CREATE INDEX IF NOT EXISTS idx_center_pricing_center ON center_pricing(center_id);
CREATE INDEX IF NOT EXISTS idx_center_reviews_center ON center_reviews(center_id);
CREATE INDEX IF NOT EXISTS idx_center_schedule_center ON center_schedule(center_id);
CREATE INDEX IF NOT EXISTS idx_center_services_center ON center_services(center_id);
CREATE INDEX IF NOT EXISTS idx_center_trainers_center ON center_trainers(center_id);
CREATE INDEX IF NOT EXISTS idx_schedules_expert ON schedules(expert_id);

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Check new columns exist
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'central_users' 
  AND column_name IN ('google_id', 'is_verified', 'is_active', 'last_login');

SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'experts' 
  AND column_name IN ('is_approved', 'is_verified', 'rating', 'total_reviews');

SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'centers' 
  AND column_name IN ('is_approved', 'is_verified', 'rating', 'total_reviews');

-- Check new tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('refresh_tokens', 'admins', 'reviews', 'audit_logs');

-- Check indexes created
SELECT indexname, tablename 
FROM pg_indexes 
WHERE schemaname = 'public' 
  AND indexname LIKE 'idx_%'
ORDER BY tablename, indexname;
