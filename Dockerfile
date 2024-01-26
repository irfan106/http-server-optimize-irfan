# Use an official Node.js runtime as the base image
FROM node:20

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install application dependencies
RUN npm install

# Copy the application files to the working directory
COPY . .

# Expose port 8080
EXPOSE 8080

# Set environment variables
ENV NODE_ENV=production

# Run the application when the container starts
ENTRYPOINT ["node", "server.js"]
