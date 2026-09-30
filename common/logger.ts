/**
 * Minimal file logger.
 * Appends newline-delimited log lines to logs/<name>.log at the package root,
 * so per-run logs ship as CI artifacts alongside Playwright traces and videos.
 */
import * as fs from 'fs';
import * as path from 'path';

const LOG_DIR = path.resolve(__dirname, '..', 'logs');

function ensureDir(): void {
  if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR, { recursive: true });
}

export function log(message: string, name = 'test-run'): void {
  ensureDir();
  const line = '[' + new Date().toISOString() + '] ' + message + '\n';
  fs.appendFileSync(path.join(LOG_DIR, name + '.log'), line);
}

export const logger = { log };
