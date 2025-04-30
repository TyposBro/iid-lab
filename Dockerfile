# {PATH_TO_THE_PROJECT}/frontend/Dockerfile

# --- Stage 1: Build ---
# Use a specific Node.js version (align with your package.json or choose LTS)
FROM node:20-alpine AS builder

# Set the working directory
WORKDIR /app

# Copy package.json and lock file
COPY package*.json ./

# Install dependencies
# Using --legacy-peer-deps based on your backend Dockerfile, adjust if needed
RUN npm install --legacy-peer-deps

# Copy the rest of the frontend source code
COPY . .

# Run the Vite build command (defined in package.json scripts)
# This will use the .env file with the placeholder __VITE_API_BASE_URL_PLACEHOLDER__
RUN npm run build

# --- Stage 2: Production ---
# Use a lightweight Nginx image
FROM nginx:stable-alpine

# Install gettext package which provides 'envsubst', needed by the entrypoint script,
# and utilities like 'mktemp' needed by the script.
RUN apk add --no-cache gettext coreutils

# Remove default Nginx configuration
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built static assets from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy the entrypoint script
COPY entrypoint.sh /entrypoint.sh

# Make the entrypoint script executable
RUN chmod +x /entrypoint.sh

# Expose port 80 (Nginx default)
EXPOSE 80

# Set the entrypoint script to run on container start
ENTRYPOINT ["/entrypoint.sh"]

# The entrypoint script will execute nginx at the end
# CMD ["nginx", "-g", "daemon off;"] # This is now handled by the entrypoint