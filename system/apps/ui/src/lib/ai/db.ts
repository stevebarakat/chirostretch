import pg from "pg";

const { Pool } = pg;

let _pool: pg.Pool | null = null;

export function getPool(): pg.Pool {
  if (!_pool) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error("DATABASE_URL environment variable is not set.");
    }
    _pool = new Pool({ connectionString });
  }
  return _pool;
}

export function isDatabaseAvailable(): boolean {
  return Boolean(process.env.DATABASE_URL);
}
