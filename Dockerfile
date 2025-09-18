# Use Node LTS
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json + lock first (better caching)
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy rest of the code
COPY . .

# Expose port
EXPOSE 4000

# Start app
CMD ["node", "index.js"]