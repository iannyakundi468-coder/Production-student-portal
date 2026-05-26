import { createPool } from '@vercel/postgres';
export const db = createPool({
    connectionString: process.env.POSTGRES_URL,
});
// Solian Wolves V1.0
