FROM node:20-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install --omit=dev

# Bundle app source
COPY . .

# Set environment variables for production
ENV NODE_ENV=production
# Cloud Run sets PORT, but we default to 8080
ENV PORT=8080

EXPOSE 8080

CMD ["npm", "start"]
