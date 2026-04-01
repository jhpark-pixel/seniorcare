FROM node:18

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm install --ignore-scripts 2>/dev/null || true

# Copy all source
COPY . .

# Prepare for production (sqlite -> postgresql)
RUN node scripts/prepare-prod.js

# Build client
WORKDIR /app/client
RUN npm install
RUN npm run build

# Build server
WORKDIR /app/server
RUN npm install
RUN npx prisma generate
RUN npm run build

WORKDIR /app

EXPOSE 4000

CMD ["sh", "-c", "node scripts/prepare-prod.js && cd server && npx prisma db push --skip-generate --accept-data-loss && npx ts-node --transpile-only run-seed.ts && node dist/index.js"]
