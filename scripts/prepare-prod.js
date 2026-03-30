const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, '..', 'prisma', 'schema.prisma');
let schema = fs.readFileSync(schemaPath, 'utf8');

schema = schema.replace(
  /datasource db \{[^}]+\}/,
  `datasource db {\n  provider = "postgresql"\n  url      = env("DATABASE_URL")\n}`
);

fs.writeFileSync(schemaPath, schema);
console.log('Prisma schema updated for production (PostgreSQL)');
