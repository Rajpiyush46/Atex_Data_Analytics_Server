/**
 * @file bug_test_data.js
 *
 * Creates and maintains the BUG Test Data table.
 *
 * Purpose:
 * - Create bug_test_data table
 * - Store Excel uploaded records
 * - Maintain test measurement data
 */
import { getPool } from "../src/config/database.js";
/**
 * Create BUG Test Data Table
 *
 * Creates the table only if it does not already exist.
 */
export async function createBugTestDataTable() {
  try {
    const pool = getPool();
    await pool.request().query(`
      IF NOT EXISTS (
        SELECT *
        FROM sys.tables
        WHERE name = 'bug_test_data'
      )
      BEGIN
        CREATE TABLE bug_test_data (
          -- Primary Key
          id INT IDENTITY(1,1) PRIMARY KEY,
          -- Test Information
          Time_stamp DATETIME,
          UUT_id VARCHAR(50),
          operator_name VARCHAR(50),
          Test_id VARCHAR(50),
          Test_condition VARCHAR(50),
          Operating_mode VARCHAR(50),
          -- Voltage Test Values
          VT1 FLOAT,
          VT2 FLOAT,
          VT3 FLOAT,
          VT4 FLOAT,
          VT5 FLOAT,
          VT6 FLOAT,
          VT7 FLOAT,
          VT8 FLOAT,
          VT9 FLOAT,
          -- Voltage Measurements
          Voltage1 FLOAT,
          Voltage2 FLOAT,
          Voltage3 FLOAT,
          -- Current Measurements
          Current1 FLOAT,
          Current2 FLOAT,
          Current3 FLOAT,
          -- Ambient Parameters
          Ambient_humidity FLOAT,
          Ambient_temperature FLOAT,
          Ambient_pressure FLOAT,
          -- BUG Parameters
          BUG_Speed FLOAT,
          BUG_Torque FLOAT,
          BUG_Oil_in_Pressure FLOAT,
          BUG_Oil_Out_Pressure FLOAT,
          BUG_Oil_in_Temperature FLOAT,
          BUG_Oil_Out_Temperature FLOAT,
          BUG_Oil_Out_Flow FLOAT,
          -- Vibration
          vibration FLOAT,
          -- Test Status
          test_status VARCHAR(20),
          -- Audit Columns
          created_at DATETIME DEFAULT GETDATE()
        )
      END
    `);
    console.log(" bug_test_data table verified successfully");
  } catch (error) {
    console.error(" Failed to create bug_test_data table");
    console.error(error);
    throw error;
  }
}
export default {
  createBugTestDataTable,
};
