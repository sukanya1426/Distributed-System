# Use the official Node.js 20 slim image as the base
FROM node:20-slim

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port the service runs on
EXPOSE 8081

# Set environment variables (optional, can be overridden)
ENV PORT=8081

# Command to start the application
CMD ["npm", "start"]