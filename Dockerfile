# -----------------------
# 1️⃣ Build Stage
# -----------------------
FROM node:18-alpine AS builder

WORKDIR /app

# Install dependencies using lock file
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# If using TypeScript, build here:
# RUN npm run build


# -----------------------
# 2️⃣ Production Stage
# -----------------------
FROM node:18-alpine

WORKDIR /app

# Copy only production dependencies
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Install OpenSSL for Prisma
RUN apk add --no-cache openssl

# Copy built app + prisma from builder
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app ./

# Create logs directory with proper permission
RUN mkdir -p /app/logs

# Create non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Give ownership to app user
RUN chown -R appuser:appgroup /app

USER appuser

EXPOSE 4000

CMD ["npm", "start"]
