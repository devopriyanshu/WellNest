-- CreateTable
CREATE TABLE "central_users" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "password" VARCHAR(255),
    "role" VARCHAR(30) NOT NULL DEFAULT 'user',
    "status" VARCHAR(20) DEFAULT 'active',
    "google_id" VARCHAR(255),
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "last_login" TIMESTAMP(6),
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "name" VARCHAR(50),
    "provider" TEXT DEFAULT 'local',

    CONSTRAINT "central_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "refresh_tokens" (
    "id" SERIAL NOT NULL,
    "token" VARCHAR(500) NOT NULL,
    "central_user_id" INTEGER NOT NULL,
    "expires_at" TIMESTAMP(6) NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "full_name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(100),
    "phone_number" VARCHAR(20),
    "gender" VARCHAR(10),
    "dob" DATE,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "is_active" BOOLEAN DEFAULT true,
    "role" VARCHAR(50) DEFAULT 'user',
    "last_login" TIMESTAMP(6),
    "profile_picture" VARCHAR(255),
    "address" TEXT,
    "language_preference" VARCHAR(50),
    "deleted_at" TIMESTAMP(6),
    "height" DECIMAL(5,2),
    "weight" DECIMAL(5,2),
    "user_id" INTEGER,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "experts" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(20),
    "category" VARCHAR(255),
    "bio" TEXT,
    "profile_image" TEXT,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "bg_image" TEXT,
    "website" TEXT,
    "location" TEXT,
    "languages" TEXT[],
    "experience" VARCHAR(100),
    "user_id" INTEGER,
    "status" VARCHAR(20) NOT NULL DEFAULT 'pending',
    "is_approved" BOOLEAN NOT NULL DEFAULT false,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "rating" DECIMAL(3,2) DEFAULT 0,
    "total_reviews" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "experts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "expert_availability" (
    "id" SERIAL NOT NULL,
    "expert_id" INTEGER,
    "day" VARCHAR(20),
    "selected" BOOLEAN,
    "start_time" TIME(6),
    "end_time" TIME(6),

    CONSTRAINT "expert_availability_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "centers" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255),
    "category" VARCHAR(100),
    "description" TEXT,
    "address" TEXT,
    "phone" VARCHAR(20),
    "email" VARCHAR(100),
    "website" VARCHAR(255),
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "offers" TEXT,
    "user_id" INTEGER,
    "latitude" DECIMAL(10,7),
    "longitude" DECIMAL(11,7),
    "center_image" TEXT,
    "status" VARCHAR(20) NOT NULL DEFAULT 'pending',
    "is_approved" BOOLEAN NOT NULL DEFAULT false,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "rating" DECIMAL(3,2) DEFAULT 0,
    "total_reviews" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "centers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admins" (
    "id" SERIAL NOT NULL,
    "central_user_id" INTEGER NOT NULL,
    "full_name" VARCHAR(255) NOT NULL,
    "phone_number" VARCHAR(20),
    "department" VARCHAR(100),
    "permissions" TEXT[],
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "appointments" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "expert_id" INTEGER NOT NULL,
    "appointment_date" TIMESTAMP(6) NOT NULL,
    "type" VARCHAR(50),
    "status" VARCHAR(50) DEFAULT 'pending',
    "notes" TEXT,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "appointments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sleep_logs" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "date" DATE NOT NULL,
    "hours" DECIMAL(4,2),
    "quality" VARCHAR(100),
    "notes" TEXT,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sleep_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activity_logs" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "activities" TEXT NOT NULL,
    "date" DATE DEFAULT CURRENT_TIMESTAMP,
    "duration" DECIMAL(5,2),
    "calories" INTEGER,
    "notes" TEXT,

    CONSTRAINT "activity_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "meal_logs" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "name" VARCHAR(100) NOT NULL,
    "date" DATE NOT NULL,
    "time" TIME(6) NOT NULL,
    "calories" INTEGER,
    "protein" INTEGER,
    "carbs" INTEGER,
    "fat" INTEGER,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "meal_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reviews" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "expert_id" INTEGER NOT NULL,
    "appointment_id" INTEGER NOT NULL,
    "rating" SMALLINT NOT NULL,
    "review_text" TEXT,
    "response_text" TEXT,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" SERIAL NOT NULL,
    "central_user_id" INTEGER NOT NULL,
    "action" VARCHAR(100) NOT NULL,
    "resource" VARCHAR(100) NOT NULL,
    "resource_id" INTEGER,
    "ip_address" VARCHAR(45),
    "user_agent" TEXT,
    "metadata" JSONB,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mental_health_assessments" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "assessment_type" VARCHAR(100),
    "assessment_subtype" VARCHAR(100),
    "score" INTEGER,
    "assessment_date" TIMESTAMP(6),
    "result" TEXT,
    "symptoms" TEXT,
    "mood_before_assessment" VARCHAR(20),
    "assessment_duration" INTEGER,
    "follow_up_recommendations" TEXT,
    "assessment_feedback" TEXT,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mental_health_assessments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mood_logs" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "mood_rating" INTEGER,
    "mood_description" TEXT,
    "log_time" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "location" VARCHAR(255),
    "mood_type" VARCHAR(50),
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mood_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stress_logs" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "stress_level" INTEGER,
    "symptoms" TEXT,
    "stressors" TEXT,
    "stress_type" VARCHAR(50),
    "duration" INTEGER,
    "coping_mechanisms" TEXT,
    "mood_at_time" VARCHAR(20),
    "location" VARCHAR(255),
    "log_time" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "stress_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "expert_id" INTEGER,
    "appointment_id" INTEGER,
    "amount" DECIMAL(10,2) NOT NULL,
    "payment_status" VARCHAR(50) DEFAULT 'pending',
    "payment_method" VARCHAR(50),
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "expert_faqs" (
    "id" SERIAL NOT NULL,
    "expert_id" INTEGER,
    "question" TEXT,
    "answer" TEXT,

    CONSTRAINT "expert_faqs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "expert_qualifications" (
    "id" SERIAL NOT NULL,
    "expert_id" INTEGER,
    "value" VARCHAR(255),

    CONSTRAINT "expert_qualifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "expert_services" (
    "id" SERIAL NOT NULL,
    "expert_id" INTEGER,
    "name" VARCHAR(100),
    "format" VARCHAR(50),
    "duration" INTEGER,
    "price" DECIMAL(10,2),

    CONSTRAINT "expert_services_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "expert_specialties" (
    "id" SERIAL NOT NULL,
    "expert_id" INTEGER,
    "value" VARCHAR(255),

    CONSTRAINT "expert_specialties_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "center_addresses" (
    "id" SERIAL NOT NULL,
    "center_id" INTEGER,
    "address_line" TEXT,
    "city" VARCHAR(100),
    "state" VARCHAR(100),
    "postal_code" VARCHAR(20),
    "country" VARCHAR(100),
    "latitude" DECIMAL(9,6),
    "longitude" DECIMAL(9,6),
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "center_addresses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "center_amenities" (
    "id" SERIAL NOT NULL,
    "center_id" INTEGER,
    "value" VARCHAR(255),

    CONSTRAINT "center_amenities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "center_classes" (
    "id" SERIAL NOT NULL,
    "center_id" INTEGER,
    "name" VARCHAR(100),
    "time" VARCHAR(50),
    "trainer" VARCHAR(100),
    "duration" VARCHAR(50),

    CONSTRAINT "center_classes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "center_equipment" (
    "id" SERIAL NOT NULL,
    "center_id" INTEGER,
    "value" VARCHAR(255),

    CONSTRAINT "center_equipment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "center_faqs" (
    "id" SERIAL NOT NULL,
    "expert_id" INTEGER,
    "question" TEXT,
    "answer" TEXT,

    CONSTRAINT "center_faqs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "center_images" (
    "id" SERIAL NOT NULL,
    "center_id" INTEGER,
    "image_url" TEXT,

    CONSTRAINT "center_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "center_pricing" (
    "id" SERIAL NOT NULL,
    "center_id" INTEGER,
    "type" VARCHAR(50),
    "price" VARCHAR(50),

    CONSTRAINT "center_pricing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "center_reviews" (
    "id" SERIAL NOT NULL,
    "center_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "rating" DECIMAL(2,1) NOT NULL,
    "review" TEXT,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "center_reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "center_schedule" (
    "id" SERIAL NOT NULL,
    "center_id" INTEGER,
    "day_of_week" VARCHAR(10) NOT NULL,
    "is_open" BOOLEAN NOT NULL DEFAULT false,
    "opening_time" TIME(6),
    "closing_time" TIME(6),
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "center_schedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "center_services" (
    "id" SERIAL NOT NULL,
    "center_id" INTEGER,
    "name" VARCHAR(100),
    "icon" VARCHAR(10),
    "description" TEXT,

    CONSTRAINT "center_services_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "center_trainers" (
    "id" SERIAL NOT NULL,
    "center_id" INTEGER,
    "name" VARCHAR(100),
    "specialty" VARCHAR(100),
    "bio" TEXT,
    "image" TEXT,

    CONSTRAINT "center_trainers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "schedules" (
    "id" SERIAL NOT NULL,
    "expert_id" INTEGER,
    "day_of_week" VARCHAR(10) NOT NULL,
    "is_open" BOOLEAN NOT NULL DEFAULT false,
    "opening_time" TIME(6),
    "closing_time" TIME(6),
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "schedules_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "central_users_email_key" ON "central_users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "central_users_google_id_key" ON "central_users"("google_id");

-- CreateIndex
CREATE UNIQUE INDEX "refresh_tokens_token_key" ON "refresh_tokens"("token");

-- CreateIndex
CREATE INDEX "refresh_tokens_central_user_id_idx" ON "refresh_tokens"("central_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "experts_email_key" ON "experts"("email");

-- CreateIndex
CREATE UNIQUE INDEX "experts_phone_key" ON "experts"("phone");

-- CreateIndex
CREATE INDEX "experts_user_id_idx" ON "experts"("user_id");

-- CreateIndex
CREATE INDEX "experts_status_idx" ON "experts"("status");

-- CreateIndex
CREATE INDEX "expert_availability_expert_id_idx" ON "expert_availability"("expert_id");

-- CreateIndex
CREATE UNIQUE INDEX "unique_email" ON "centers"("email");

-- CreateIndex
CREATE INDEX "centers_user_id_idx" ON "centers"("user_id");

-- CreateIndex
CREATE INDEX "centers_status_idx" ON "centers"("status");

-- CreateIndex
CREATE UNIQUE INDEX "admins_central_user_id_key" ON "admins"("central_user_id");

-- CreateIndex
CREATE INDEX "admins_central_user_id_idx" ON "admins"("central_user_id");

-- CreateIndex
CREATE INDEX "appointments_user_id_idx" ON "appointments"("user_id");

-- CreateIndex
CREATE INDEX "appointments_expert_id_idx" ON "appointments"("expert_id");

-- CreateIndex
CREATE INDEX "appointments_appointment_date_idx" ON "appointments"("appointment_date");

-- CreateIndex
CREATE INDEX "appointments_status_idx" ON "appointments"("status");

-- CreateIndex
CREATE INDEX "sleep_logs_user_id_date_idx" ON "sleep_logs"("user_id", "date");

-- CreateIndex
CREATE INDEX "activity_logs_user_id_date_idx" ON "activity_logs"("user_id", "date");

-- CreateIndex
CREATE INDEX "meal_logs_user_id_date_idx" ON "meal_logs"("user_id", "date");

-- CreateIndex
CREATE UNIQUE INDEX "reviews_appointment_id_key" ON "reviews"("appointment_id");

-- CreateIndex
CREATE INDEX "reviews_expert_id_idx" ON "reviews"("expert_id");

-- CreateIndex
CREATE INDEX "reviews_user_id_idx" ON "reviews"("user_id");

-- CreateIndex
CREATE INDEX "audit_logs_central_user_id_idx" ON "audit_logs"("central_user_id");

-- CreateIndex
CREATE INDEX "audit_logs_action_idx" ON "audit_logs"("action");

-- CreateIndex
CREATE INDEX "audit_logs_created_at_idx" ON "audit_logs"("created_at");

-- CreateIndex
CREATE INDEX "mental_health_assessments_user_id_idx" ON "mental_health_assessments"("user_id");

-- CreateIndex
CREATE INDEX "mood_logs_user_id_idx" ON "mood_logs"("user_id");

-- CreateIndex
CREATE INDEX "stress_logs_user_id_idx" ON "stress_logs"("user_id");

-- CreateIndex
CREATE INDEX "payments_user_id_idx" ON "payments"("user_id");

-- CreateIndex
CREATE INDEX "payments_expert_id_idx" ON "payments"("expert_id");

-- CreateIndex
CREATE INDEX "expert_faqs_expert_id_idx" ON "expert_faqs"("expert_id");

-- CreateIndex
CREATE INDEX "expert_qualifications_expert_id_idx" ON "expert_qualifications"("expert_id");

-- CreateIndex
CREATE INDEX "expert_services_expert_id_idx" ON "expert_services"("expert_id");

-- CreateIndex
CREATE INDEX "expert_specialties_expert_id_idx" ON "expert_specialties"("expert_id");

-- CreateIndex
CREATE INDEX "center_addresses_center_id_idx" ON "center_addresses"("center_id");

-- CreateIndex
CREATE INDEX "center_amenities_center_id_idx" ON "center_amenities"("center_id");

-- CreateIndex
CREATE INDEX "center_classes_center_id_idx" ON "center_classes"("center_id");

-- CreateIndex
CREATE INDEX "center_equipment_center_id_idx" ON "center_equipment"("center_id");

-- CreateIndex
CREATE INDEX "center_faqs_expert_id_idx" ON "center_faqs"("expert_id");

-- CreateIndex
CREATE INDEX "center_images_center_id_idx" ON "center_images"("center_id");

-- CreateIndex
CREATE INDEX "center_pricing_center_id_idx" ON "center_pricing"("center_id");

-- CreateIndex
CREATE INDEX "center_reviews_center_id_idx" ON "center_reviews"("center_id");

-- CreateIndex
CREATE INDEX "center_schedule_center_id_idx" ON "center_schedule"("center_id");

-- CreateIndex
CREATE INDEX "center_services_center_id_idx" ON "center_services"("center_id");

-- CreateIndex
CREATE INDEX "center_trainers_center_id_idx" ON "center_trainers"("center_id");

-- CreateIndex
CREATE INDEX "schedules_expert_id_idx" ON "schedules"("expert_id");

-- AddForeignKey
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_central_user_id_fkey" FOREIGN KEY ("central_user_id") REFERENCES "central_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "central_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "experts" ADD CONSTRAINT "experts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "central_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expert_availability" ADD CONSTRAINT "expert_availability_expert_id_fkey" FOREIGN KEY ("expert_id") REFERENCES "experts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "centers" ADD CONSTRAINT "centers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "central_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admins" ADD CONSTRAINT "admins_central_user_id_fkey" FOREIGN KEY ("central_user_id") REFERENCES "central_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_expert_id_fkey" FOREIGN KEY ("expert_id") REFERENCES "experts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sleep_logs" ADD CONSTRAINT "sleep_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity_logs" ADD CONSTRAINT "activity_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meal_logs" ADD CONSTRAINT "meal_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_expert_id_fkey" FOREIGN KEY ("expert_id") REFERENCES "experts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_appointment_id_fkey" FOREIGN KEY ("appointment_id") REFERENCES "appointments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_central_user_id_fkey" FOREIGN KEY ("central_user_id") REFERENCES "central_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mental_health_assessments" ADD CONSTRAINT "mental_health_assessments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mood_logs" ADD CONSTRAINT "mood_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stress_logs" ADD CONSTRAINT "stress_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_expert_id_fkey" FOREIGN KEY ("expert_id") REFERENCES "experts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expert_faqs" ADD CONSTRAINT "expert_faqs_expert_id_fkey" FOREIGN KEY ("expert_id") REFERENCES "experts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expert_qualifications" ADD CONSTRAINT "expert_qualifications_expert_id_fkey" FOREIGN KEY ("expert_id") REFERENCES "experts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expert_services" ADD CONSTRAINT "expert_services_expert_id_fkey" FOREIGN KEY ("expert_id") REFERENCES "experts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expert_specialties" ADD CONSTRAINT "expert_specialties_expert_id_fkey" FOREIGN KEY ("expert_id") REFERENCES "experts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "center_addresses" ADD CONSTRAINT "center_addresses_center_id_fkey" FOREIGN KEY ("center_id") REFERENCES "centers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "center_amenities" ADD CONSTRAINT "center_amenities_center_id_fkey" FOREIGN KEY ("center_id") REFERENCES "centers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "center_classes" ADD CONSTRAINT "center_classes_center_id_fkey" FOREIGN KEY ("center_id") REFERENCES "centers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "center_equipment" ADD CONSTRAINT "center_equipment_center_id_fkey" FOREIGN KEY ("center_id") REFERENCES "centers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "center_faqs" ADD CONSTRAINT "center_faqs_expert_id_fkey" FOREIGN KEY ("expert_id") REFERENCES "centers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "center_images" ADD CONSTRAINT "center_images_center_id_fkey" FOREIGN KEY ("center_id") REFERENCES "centers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "center_pricing" ADD CONSTRAINT "center_pricing_center_id_fkey" FOREIGN KEY ("center_id") REFERENCES "centers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "center_reviews" ADD CONSTRAINT "center_reviews_center_id_fkey" FOREIGN KEY ("center_id") REFERENCES "centers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "center_schedule" ADD CONSTRAINT "center_schedule_center_id_fkey" FOREIGN KEY ("center_id") REFERENCES "centers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "center_services" ADD CONSTRAINT "center_services_center_id_fkey" FOREIGN KEY ("center_id") REFERENCES "centers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "center_trainers" ADD CONSTRAINT "center_trainers_center_id_fkey" FOREIGN KEY ("center_id") REFERENCES "centers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schedules" ADD CONSTRAINT "schedules_expert_id_fkey" FOREIGN KEY ("expert_id") REFERENCES "centers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
