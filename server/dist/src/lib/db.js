// src/db.ts
import pg from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
// Import the client matching your custom output path
import { PrismaClient } from "../generated/prisma/client.js";
// 1. Setup the native PostgreSQL connection pooler (pointing to transaction port 6543)
const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
});
// 2. Wrap it inside the Prisma adapter instance
const adapter = new PrismaPg(pool);
// 3. Instantiate and export the client wrapped around the adapter
export const prisma = new PrismaClient({ adapter });
//# sourceMappingURL=db.js.map