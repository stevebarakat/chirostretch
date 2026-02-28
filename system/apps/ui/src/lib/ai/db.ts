import pg from "pg";

const { Pool } = pg;

let _pool: pg.Pool | null = null;

export function getPool(): pg.Pool {
  if (!_pool) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error("DATABASE_URL environment variable is not set.");
    }
    const isRemote = !connectionString.includes("localhost") && !connectionString.includes("127.0.0.1");
    // Strip sslmode from URL so pg doesn't override our ssl config
    const cleanUrl = connectionString.replace(/[?&]sslmode=[^&]+/, "");
    _pool = new Pool({
      connectionString: cleanUrl,
      ssl: isRemote ? { rejectUnauthorized: false } : false,
    });
  }
  return _pool;
}

export function isDatabaseAvailable(): boolean {
  return Boolean(process.env.DATABASE_URL);
}
