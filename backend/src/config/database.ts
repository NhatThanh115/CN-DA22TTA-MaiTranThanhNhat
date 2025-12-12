import sql from "mssql";
import { load } from "@std/dotenv";

// Load environment variables
await load({ export: true });

// Database configuration
const dbConfig: sql.config = {
  server: Deno.env.get("DB_SERVER") || "db",
  port: parseInt(Deno.env.get("DB_PORT") || "1433"),
  database: Deno.env.get("DB_DATABASE") || "tvenglish",
  user: Deno.env.get("DB_USER") || "sa",
  password: Deno.env.get("DB_PASSWORD") || "TestPass@123",
  options: {
    encrypt: Deno.env.get("DB_ENCRYPT") === "true",
    trustServerCertificate: Deno.env.get("DB_TRUST_SERVER_CERTIFICATE") === "true",
    enableArithAbort: true,
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
};

// Create connection pool
let pool: sql.ConnectionPool | null = null;

/**
 * Get database connection pool
 */
export async function getPool(): Promise<sql.ConnectionPool> {
  if (!pool) {
    pool = await sql.connect(dbConfig);
    console.log("✅ Database connected successfully");
  }
  return pool;
}

/**
 * Test database connection
 */
/**
 * Test database connection with retries
 */
async function testConnection(retries = 10, delay = 5000) {
  for (let i = 0; i < retries; i++) {
    try {
      await getPool();
      const result = await pool!.request().query("SELECT 1 AS test");
      console.log("✅ Database connection test passed");
      return;
    } catch (error) {
      console.error(`❌ Database connection failed (attempt ${i + 1}/${retries}):`, error);
      if (i === retries - 1) {
        console.error("❌ Max retries reached. Exiting...");
        throw error;
      }
      console.log(`⏳ Retrying in ${delay / 1000} seconds...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
}

// Initialize database connection
await testConnection();

export { sql };
