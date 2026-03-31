FROM node:18-alpine

WORKDIR /app

# Copy source
COPY . .

# Prepare for production
RUN node scripts/prepare-prod.js

# Install and build client
RUN cd client && npm install && npm run build

# Install and build server
RUN cd server && npm install && npx prisma generate && npm run build

# Start
CMD ["sh", "-c", "node scripts/prepare-prod.js && cd server && npx prisma db push --skip-generate --accept-data-loss && node dist/index.js"]
