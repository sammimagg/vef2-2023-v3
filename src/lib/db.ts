import pg from "pg";
import dotenv from 'dotenv';

dotenv.config({ path: ".env" });

const connectionString = process.env.DATABASE_URL;
const nodeEnv = process.env.NODE_ENV || 'development';

const ssl = nodeEnv === 'production' ? {rejectUnauthorized: false} : false
const pool = new pg.Pool({ connectionString, ssl });

if (!connectionString) {
    console.error('vantar DATABASE_URL í .env');
    process.exit(-1);
  }
pool.on("error", (err: Error) => {
  console.error("Villa í tengingu við gagnagrunn, forrit hættir", err);
  process.exit(-1);
});

type QueryType = string | number | null;
export async function query(q: string, values: Array<QueryType> = []) {
    let client;
    try {
      client = await pool.connect();
    } catch (e) {
      console.error('unable to get client from pool', e);
      return null;
    }
  
    try {
      const result = await client.query(q, values);
      return result;
    } catch (e) {
      console.error('unable to query', e);
      console.info(q, values);
      return null;
    } finally {
      client.release();
    }
}

export async function end() {
  await pool.end();
}
