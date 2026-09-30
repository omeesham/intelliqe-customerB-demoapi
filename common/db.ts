/**
 * Reusable Azure SQL / SQL Server connection helper for database validation.
 *
 * Configuration comes ENTIRELY from environment variables (see .env.example);
 * in CI these are provided by GitHub Actions secrets. Nothing is hardcoded, so
 * the same code links to any customer's Azure SQL database by pointing the
 * secrets at it. Use it from a spec or page object to assert on DB state:
 *
 *   import { db } from '../../common/db';
 *   const row = await db.queryOne('SELECT id FROM Orders WHERE ref = @ref', { ref });
 *   expect(row).not.toBeNull();
 */
import sql from 'mssql';

let poolPromise: Promise<sql.ConnectionPool> | null = null;

function buildConfig(): sql.config {
  const connectionString = process.env.DB_CONNECTION_STRING;
  if (connectionString) {
    // A full connection string takes precedence over discrete fields.
    return { connectionString } as unknown as sql.config;
  }
  const port = Number(process.env.DB_PORT || 1433);
  const encryptOff = /^(0|false|no|off)$/i.test(process.env.DB_ENCRYPT || '');
  return {
    server: process.env.DB_SERVER || 'localhost',
    database: process.env.DB_DATABASE || '',
    user: process.env.DB_USER || '',
    password: process.env.DB_PASSWORD || '',
    port: Number.isFinite(port) && port > 0 ? port : 1433,
    options: {
      // Azure SQL requires encryption; disable only for a local dev server.
      encrypt: !encryptOff,
      trustServerCertificate: /^(1|true|yes|on)$/i.test(process.env.DB_TRUST_SERVER_CERT || ''),
    },
    pool: { max: 5, min: 0, idleTimeoutMillis: 30000 },
  };
}

/** Lazily create and reuse a single connection pool for the whole run. */
export async function getPool(): Promise<sql.ConnectionPool> {
  if (!poolPromise) {
    poolPromise = new sql.ConnectionPool(buildConfig()).connect().catch((err) => {
      poolPromise = null; // let a later call retry after a failed connect
      throw err;
    });
  }
  return poolPromise;
}

/** Run a parameterized query and return all rows. Params bind as @key. */
export async function query<T = any>(text: string, params: Record<string, unknown> = {}): Promise<T[]> {
  const pool = await getPool();
  const request = pool.request();
  for (const [key, value] of Object.entries(params)) request.input(key, value as any);
  const result = await request.query<T>(text);
  return result.recordset as T[];
}

/** Run a query and return the first row, or null when there are none. */
export async function queryOne<T = any>(text: string, params: Record<string, unknown> = {}): Promise<T | null> {
  const rows = await query<T>(text, params);
  return rows.length > 0 ? (rows[0] as T) : null;
}

/** True when the query returns at least one row — handy for existence asserts. */
export async function exists(text: string, params: Record<string, unknown> = {}): Promise<boolean> {
  const rows = await query(text, params);
  return rows.length > 0;
}

/** Close the pool (called from global teardown so the process exits cleanly). */
export async function closePool(): Promise<void> {
  if (!poolPromise) return;
  const pool = await poolPromise.catch(() => null);
  poolPromise = null;
  if (pool) await pool.close();
}

export const db = { getPool, query, queryOne, exists, closePool };
