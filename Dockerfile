FROM node:18-alpine

WORKDIR /app

# Copy all source files
COPY . .

# Install root deps
RUN npm install --ignore-scripts 2>/dev/null || true

# Prepare for production (sqlite -> postgresql)
RUN node scripts/prepare-prod.js

# Build client
RUN cd client && npm install && npm run build && ls -la dist/

# Build server
RUN cd server && npm install && npx prisma generate && npm run build

EXPOSE 4000

CMD ["sh", "-c", "node scripts/prepare-prod.js && cd server && npx prisma db push --skip-generate --accept-data-loss && node dist/index.js"]
