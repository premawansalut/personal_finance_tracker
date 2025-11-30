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

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install --omit=dev

COPY . .

ENV NODE_ENV=production

ENV PORT=8080

EXPOSE 8080

CMD ["npm", "start"]
