# ---- Base ----
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install deps
RUN npm install

# Copy source
COPY . .

# Expose port (adjust if needed)
EXPOSE 5000

# Start server
CMD ["npm", "run", "dev"]