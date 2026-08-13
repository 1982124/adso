import fs from "node:fs";
import path from "node:path";

const schemaPath = path.resolve("prisma/schema.prisma");
const schema = fs.readFileSync(schemaPath, "utf8");

if (!schema.includes('provider = "sqlite"') && !schema.includes('provider = "postgresql"')) {
  throw new Error("Prisma datasource provider was not found; refusing to mutate the schema.");
}

const postgresSchema = schema.replace('provider = "sqlite"', 'provider = "postgresql"');
fs.writeFileSync(schemaPath, postgresSchema, "utf8");
console.log("Prisma production schema prepared for PostgreSQL/Neon.");
