# Image base de Node.js
FROM node:20-alpine

# Working directory inside the container
WORKDIR /usr/src/app

# Copy dependency definition files before the code
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the source code (src, tsconfig.json, etc.)
COPY . .

# Expose the port
EXPOSE 3000

# Compiles TypeScript code to JavaScript
# RUN npm run build


# Command to run the application
# CMD ["npm", "start"]
CMD ["npx", "ts-node-dev", "--respawn", "--transpile-only", "src/index.ts"]