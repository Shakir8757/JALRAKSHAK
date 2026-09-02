import pg from 'pg';
import { env } from './config/env.js';

const { Pool } = pg;
export const pool = env.DATABASE_URL ? new Pool({ connectionString: env.DATABASE_URL }) : null;

export async function checkDatabase() {
  if (!pool) return { connected: false, configured: false };
  const result = await pool.query('SELECT current_database() AS database, PostGIS_Version() AS postgis');
  return { connected: true, configured: true, ...result.rows[0] };
}
