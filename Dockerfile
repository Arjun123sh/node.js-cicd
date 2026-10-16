# Use the same node version from your previous logs
FROM node:22-alpine

# Set working directory inside the container
WORKDIR /app

# Copy dependency manifests first to leverage Docker layer caching
COPY package*.json ./

# Install production dependencies
RUN npm install

# Copy the rest of your application code (including the src directory)
COPY . .

# Expose the port your node application listens on (e.g., 3000 or 8080)
EXPOSE 3000

# Start the application using your entry point file
CMD ["node", "src/server.js"]
