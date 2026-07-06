/**
 * @file import_logs.js
 *
 * Creates and maintains Excel import history.
 *
 * Purpose:
 * - Track uploaded Excel files
 * - Track imported row counts
 * - Track success/failure status
 * - Support audit/history reporting
 */

import { getPool } from "../src/config/database.js";

/**
 * Create Import Log Table
 *
 * Stores all Excel import operations.
 */
export async function createImportLogTable() {
  try {
    const pool = getPool();

    await pool.request().query(`
      IF NOT EXISTS (
        SELECT *
        FROM sys.tables
        WHERE name = 'import_logs'
      )
      BEGIN
        CREATE TABLE import_logs (
          -- Unique Import ID
          import_id INT IDENTITY(1,1) PRIMARY KEY,
          -- Uploaded Excel File Name
          file_name VARCHAR(255) NOT NULL,
          -- Total Records Found In Excel
          total_rows INT NOT NULL,
          -- Successfully Imported Records
          imported_rows INT NOT NULL,
        -- Import Status
          status VARCHAR(50) NOT NULL,
          -- Created Timestamp
          created_at DATETIME DEFAULT GETDATE()
        )
      END
    `);
    console.log("import_logs table verified successfully");
  } catch (error) {
    console.error("Failed to create import_logs table");
    console.error(error);
    throw error;
  }
}
export default {
  createImportLogTable,
};
