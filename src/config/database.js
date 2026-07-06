/**
 * @file database.js
 *
 * SQL Server Database Configuration
 *
 * Creates and exports a reusable
 * SQL Server connection pool.
 */
import sql from "mssql";
import dotenv from "dotenv";

dotenv.config();

/**
 * SQL Server Connection Configuration
 */
const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  server: process.env.DB_SERVER,
  port: Number(process.env.DB_PORT),

  options: {
    encrypt: process.env.DB_ENCRYPT === "true",
    trustServerCertificate: process.env.DB_TRUST_CERT === "true",
  },
};

let pool;
/**
 * Establish Database Connection
 *
 * @returns {Promise<sql.ConnectionPool>}
 */
export async function connectDatabase() {
  try {
    pool = await sql.connect(dbConfig);
    console.log(" SQL Server Database Connected Successfully");
    return pool;
  } catch (error) {
    console.error(" Database Connection Failed");
    console.error(error.message);
    throw error;
  }
}

/**
 * Get Existing Connection Pool
 *
 * @returns {sql.ConnectionPool}
 */
export function getPool() {
  return pool;
}
export default {
  sql,
  connectDatabase,
  getPool,
};
