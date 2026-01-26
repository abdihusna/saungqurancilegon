# Use Node.js LTS version
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json (or bun.lockb if using bun)
COPY package*.json ./
COPY bun.lockb* ./

# Install dependencies based on available lock file
RUN if [ -f bun.lockb ]; then \
    npm install -g bun && \
    bun install; \
    else \
    npm ci; \
    fi

# Copy source code
COPY . .

# Build the application
RUN if [ -f bun.lockb ]; then \
    bun run build; \
    else \
    npm run build; \
    fi

# For development, we can use this instead of building
# Uncomment the following lines for development mode

# Expose port
EXPOSE 5173

# Start the development server
CMD if [ -f bun.lockb ]; then \
    bun run dev --host 0.0.0.0 --port 5173; \
    else \
    npm run dev -- --host 0.0.0.0 --port 5173; \
    fi
