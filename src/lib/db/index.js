import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from './schema.js';
import path from 'path';

// Singleton for Next.js hot reload / server environments
const globalForDb = globalThis;

const dbPath = path.join(process.cwd(), 'camo.db');
const fileUrl = `file:${dbPath.replace(/\\/g, '/')}`;

const client = globalForDb.libsqlClient || createClient({
  url: fileUrl,
});

if (process.env.NODE_ENV !== 'production') {
  globalForDb.libsqlClient = client;
}

export const db = drizzle(client, { schema });
export { client };
