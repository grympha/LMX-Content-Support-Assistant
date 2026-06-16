import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

function createDb() {
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  const sql = neon(url);
  return drizzle(sql, { schema });
}

// db is null when DATABASE_URL is not configured.
// All routes that use db must check for null and return 503 gracefully.
export const db = createDb();

export type Db = NonNullable<typeof db>;
