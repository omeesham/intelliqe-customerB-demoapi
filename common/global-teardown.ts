/**
 * Playwright global teardown. Closes the shared DB connection pool (if a test
 * opened one) so the Node process exits cleanly. No-op when the database was
 * never used.
 */
import { closePool } from './db';

export default async function globalTeardown(): Promise<void> {
  await closePool();
}
