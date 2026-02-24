/**
 * AI Knowledge Index — Reset Script (dev only)
 *
 * Usage:
 *   pnpm ai:reset
 */

import { config } from "dotenv";
config({ path: ".env" });
config({ path: ".env.local", override: true });
import { getPool, isDatabaseAvailable } from "../../src/lib/ai/db.js";

async function main() {
  if (!isDatabaseAvailable()) {
    console.error("DATABASE_URL is not set. Nothing to reset.");
    process.exit(1);
  }

  const pool = getPool();

  console.log("Truncating ai_documents table...");
  await pool.query("TRUNCATE TABLE ai_documents RESTART IDENTITY");
  console.log("Done. All AI documents have been removed.");

  await pool.end();
  process.exit(0);
}

main().catch((err) => {
  console.error("Reset failed:", err);
  process.exit(1);
});
