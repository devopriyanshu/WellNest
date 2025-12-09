# Use official Node.js LTS runtime
FROM node:18-alpine

# Create app directory
WORKDIR /app

# Copy package.json and package-lock.json first
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of the application code
COPY . .

# Expose internal container port
EXPOSE 4000

# Start the app
CMD ["npm", "start"]
