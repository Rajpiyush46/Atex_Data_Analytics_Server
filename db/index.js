/**
 * @file index.js
 *
 * Database Initialization
 *
 * Responsibilities:
 * - Create all required tables
 * - Verify schema at application startup
 */

import { createBugTestDataTable } from "./bug_test_data.js";
import { createImportLogTable } from "./import_logs.js";

/**
 * Initialize Database
 */
export async function initializeDatabase() {
  try {
    console.log("Initializing Database...");
    await createBugTestDataTable();
    await createImportLogTable();
    console.log("Database Initialized Successfully");
  } catch (error) {
    console.error("Database Initialization Failed");
    console.error(error);
    throw error;
  }
}
export default {
  initializeDatabase,
};
