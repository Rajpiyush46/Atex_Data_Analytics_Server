import { getPool } from "../config/database.js";

export async function getBUGSpeedData(filters) {
  try {
    const { fromDate, toDate, fromTime, toTime } = filters;

    const pool = getPool();

    let query = `
      SELECT
        Time_stamp,
        UUT_id,
        Test_id,
        BUG_Speed
      FROM bug_test_data
      WHERE 1 = 1
    `;

    const request = pool.request();

    /**
     * Single Date
     */
    if (fromDate && !toDate && !fromTime && !toTime) {
      query += `
        AND CAST(
          TRY_CONVERT(
            DATETIME,
            Time_stamp,
            103
          ) AS DATE
        ) = @fromDate
      `;

      request.input("fromDate", fromDate);
    }

    /**
     * Date Range
     */
    if (fromDate && toDate && !fromTime && !toTime) {
      query += `
        AND CAST(
          TRY_CONVERT(
            DATETIME,
            Time_stamp,
            103
          ) AS DATE
        )
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
        AND TRY_CONVERT(
          DATETIME,
          Time_stamp,
          103
        ) =
        TRY_CONVERT(
          DATETIME,
          @exactDateTime,
          103
        )
      `;

      request.input("exactDateTime", exactDateTime);
    }

    /**
     * Date Range + Time Range
     */
    if (fromDate && toDate && fromTime && toTime) {
      const startDateTime = `${fromDate} ${fromTime}`;

      const endDateTime = `${toDate} ${toTime}`;

      query += `
        AND TRY_CONVERT(
          DATETIME,
          Time_stamp,
          103
        )
        BETWEEN
        TRY_CONVERT(
          DATETIME,
          @startDateTime,
          103
        )
        AND
        TRY_CONVERT(
          DATETIME,
          @endDateTime,
          103
        )
      `;

      request.input("startDateTime", startDateTime);

      request.input("endDateTime", endDateTime);
    }

    query += `
      ORDER BY
      TRY_CONVERT(DATETIME, Time_stamp, 103)
    `;

    const result = await request.query(query);

    return result.recordset;
  } catch (error) {
    console.error("Error Fetching BUG Speed", error);
    throw error;
  }
}
