import { Pool } from "pg";
import "dotenv/config";

const pool = new Pool({
  host: process.env.POSTGRES_HOST || "127.0.0.1",
  port: Number(process.env.POSTGRES_PORT || 5432),
  user: process.env.POSTGRES_USER || "postgres",
  password: process.env.POSTGRES_PASSWORD || "postgres",
  database: process.env.POSTGRES_DB || "postgres",
  ssl:
    process.env.POSTGRES_SSL === "true" ? { rejectUnauthorized: false } : false,
  connectionTimeoutMillis: 10_000,
});

pool.on("error", (err) => console.error("Unexpected pg pool error:", err));

export default pool;
