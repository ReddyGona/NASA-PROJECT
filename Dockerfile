# Install dependencies only when needed
FROM node:18-alpine3.18 AS builder

WORKDIR /nasa-project

COPY package.json package-lock.json ./

COPY client/package.json client/
RUN npm run install-client --omit=dev

COPY server/package.json server/
RUN npm run install-server --omit=dev

COPY client/ client/
RUN npm run build --prefix client

COPY server/ server/

USER node

CMD ["npm", "start" , "--prefix", "server"]

EXPOSE 8000

# FROM ubuntu:latest

# # Install necessary tools and dependencies
# RUN apt-get update && \
#     apt-get install -y curl && \
#     curl -fsSL https://deb.nodesource.com/setup_lts.x | bash - && \
#     apt-get install -y nodejs && \
#     apt-get clean && \
#     rm -rf /var/lib/apt/lists/*

# # Set the working directory
# WORKDIR /app

# # Copy package.json and package-lock.json for client and install dependencies
# COPY package*.json ./
# COPY client/package*.json client/
# RUN npm install --omit=dev --prefix client

# # Copy package.json and package-lock.json for server and install dependencies
# COPY server/package*.json server/
# RUN npm install --omit=dev --prefix server

# # Copy client files and build the client
# COPY client/ client/
# RUN npm run build --prefix client

# # Copy server files
# COPY server/ server/

# # Change user to non-root (node)
# USER node

# # Command to start the application
# CMD ["npm", "start", "--prefix", "server"]

# # Expose the necessary port
# EXPOSE 8000
