# Dockerfile for Backend on Railway
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy application code
COPY . .

# Expose port
EXPOSE 5000

# Start the application
CMD ["node", "src/index.js"]
