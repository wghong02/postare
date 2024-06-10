# Define the base node image from the official Docker Hub Node repository
FROM node:18 AS builder

# Set the working directory in the Docker container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install all dependencies
RUN npm install

# Copy the entire project
COPY . .

# Display contents of /app to ensure everything is copied correctly
RUN ls -al /app

# Build the application
RUN npm run build

# Display the build output for debugging
RUN ls -al /app

# Start a new stage from scratch using a smaller base image
FROM node:18-alpine

# Set the working directory in the Docker container
WORKDIR /app

# Copy built files from the builder stage
COPY --from=builder /app/next.config.js .
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

# Expose the port the app runs on
EXPOSE 3000

# Define the command to run your app using CMD which defines your runtime
CMD ["npm", "start"]
