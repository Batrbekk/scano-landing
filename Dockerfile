# Start from the official Node.js LTS base image
FROM node:18.19.1-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN npm install -g pnpm && pnpm install

# Copy the rest of the code
COPY . .

# Build the Next.js app
RUN pnpm run build

# Expose the port the app runs in
EXPOSE 3000

# Start the app
CMD ["pnpm", "start"]
