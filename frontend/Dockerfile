# Use Node Alpine
FROM node:20-alpine

WORKDIR /app

# Install bash and curl for debugging
RUN apk add --no-cache bash curl

# Copy package files and install deps
COPY package.json package-lock.json* ./
RUN npm install

# Copy source
COPY . .

# Expose port
EXPOSE 3000

# Start Vite dev server binding to all interfaces
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
