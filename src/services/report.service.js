import { getPool } from "../config/database.js";

export async function getReportSummary() {
  try {
    const pool = getPool();

    // Total Records
    const totalRecordsResult = await pool.request().query(`
      SELECT COUNT(*) AS totalRecords
      FROM bug_test_data
    `);

    // Sample Record For Columns
    const sampleRecordResult = await pool.request().query(`
      SELECT TOP 1 *
      FROM bug_test_data
    `);

    // Pass Rate
    const passRateResult = await pool.request().query(`
      SELECT
        CAST(
          (
            COUNT(
              CASE
                WHEN UPPER(ISNULL(test_status,'')) = 'PASS'
                THEN 1
              END
            ) * 100.0
          ) / NULLIF(COUNT(*),0)
        AS DECIMAL(10,2)
        ) AS passRate
      FROM bug_test_data
    `);

    // BUG Speed Statistics
    const speedStatsResult = await pool.request().query(`
      SELECT
        AVG(BUG_Speed) AS avgSpeed,
        MIN(BUG_Speed) AS minSpeed,
        MAX(BUG_Speed) AS maxSpeed,
        STDEV(BUG_Speed) AS stdDevSpeed
      FROM bug_test_data
      WHERE BUG_Speed IS NOT NULL
    `);

    const totalRecords = totalRecordsResult.recordset?.[0]?.totalRecords || 0;

    const columns =
      sampleRecordResult.recordset?.length > 0
        ? Object.keys(sampleRecordResult.recordset[0])
        : [];

    const passRate = passRateResult.recordset?.[0]?.passRate || 0;

    const speedStats = speedStatsResult.recordset?.[0] || {};

    return {
      fileName: "Latest Uploaded Report",

      uploadDate: new Date(),

      totalRecords,

      totalColumns: columns.length,

      columns,

      categories: 1,

      healthScore: 95,

      passRate,

      statistics: [
        {
          parameter: "BUG_Speed",
          min: speedStats.minSpeed || 0,
          max: speedStats.maxSpeed || 0,
          avg: speedStats.avgSpeed || 0,
          stdDev: speedStats.stdDevSpeed || 0,
          unit: "RPM",
        },
      ],
    };
  } catch (error) {
    console.error("Report Summary Service Error:", error);

    throw error;
  }
}

export default {
  getReportSummary,
};
