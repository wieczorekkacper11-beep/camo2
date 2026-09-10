import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/lib/db/schema.js',
  out: './src/lib/db/migrations',
  dialect: 'sqlite',
  dbCredentials: {
    url: './camo.db',
  },
});
