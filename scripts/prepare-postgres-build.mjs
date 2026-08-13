import { readFile, writeFile } from 'node:fs/promises';

const schemaPath = new URL('../prisma/schema.prisma', import.meta.url);
const schema = await readFile(schemaPath, 'utf8');

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is required for the production PostgreSQL build.');
}

const postgresSchema = schema.replace('provider = "sqlite"', 'provider = "postgresql"');
await writeFile(schemaPath, postgresSchema);

console.log('[ADSO] Prisma schema prepared for PostgreSQL/Neon.');
