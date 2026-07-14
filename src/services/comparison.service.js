import { getPool } from "../config/database.js";

export async function getComparisonData(filters) {
  try {
    const { xParameter, yParameter, fromDate, toDate, fromTime, toTime } =
      filters;

    const pool = getPool();

    const request = pool.request();

    let query = `
      SELECT
        Time_stamp,
        UUT_id,
        Test_id,
        ${xParameter} AS x,
        ${yParameter} AS y
      FROM bug_test_data
      WHERE 1 = 1
    `;

    /**
     * Single Date
     */
    if (fromDate && !toDate && !fromTime && !toTime) {
      query += `
        AND CAST(Time_stamp AS DATE) = @fromDate
      `;

      request.input("fromDate", fromDate);
    }

    /**
     * Date Range
     */
    if (fromDate && toDate && !fromTime && !toTime) {
      query += `
        AND CAST(Time_stamp AS DATE)
        BETWEEN @fromDate
        AND @toDate
      `;

      request.input("fromDate", fromDate);
      request.input("toDate", toDate);
    }

    /**
     * Exact Date + Time
     */
    if (fromDate && fromTime && !toDate && !toTime) {
      const exactDateTime = `${fromDate} ${fromTime}`;

      query += `
        AND Time_stamp = @exactDateTime
      `;

      request.input("exactDateTime", exactDateTime);
    }

    /**
     * Date + Time Range
     */
    if (fromDate && toDate && fromTime && toTime) {
      const startDateTime = `${fromDate} ${fromTime}`;
      const endDateTime = `${toDate} ${toTime}`;

      query += `
        AND Time_stamp
        BETWEEN @startDateTime
        AND @endDateTime
      `;

      request.input("startDateTime", startDateTime);
      request.input("endDateTime", endDateTime);
    }

    query += `
      ORDER BY Time_stamp
    `;

    const result = await request.query(query);

    return result.recordset;
  } catch (error) {
    console.error("Error Fetching Comparison Data", error);
    throw error;
  }
}

export default {
  getComparisonData,
};
