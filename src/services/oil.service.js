import { getPool } from "../config/database.js";

const COLUMN_MAP = {
  BugOilPressure: {
    db: "BUG_Oil_in_Pressure",
    alias: "BugOilPressure",
  },

  BugOilOutPressure: {
    db: "BUG_Oil_Out_Pressure",
    alias: "BugOilOutPressure",
  },

  BugOilTemperature: {
    db: "BUG_Oil_in_Temperature",
    alias: "BugOilTemperature",
  },

  BugOilOutTemperature: {
    db: "BUG_Oil_Out_Temperature",
    alias: "BugOilOutTemperature",
  },

  BugOilOutFlow: {
    db: "BUG_Oil_Out_Flow",
    alias: "BugOilOutFlow",
  },
};

export async function getOilData(oilName, filters) {
  try {
    const { fromDate, toDate, fromTime, toTime } = filters;

    const pool = getPool();

    const config = COLUMN_MAP[oilName];

    if (!config) {
      throw new Error(`Unsupported oil parameter: ${oilName}`);
    }

    const columnName = config.db;
    const aliasName = config.alias;

    if (!columnName) {
      throw new Error(`Unsupported oil parameter: ${oilName}`);
    }

    console.log("Oil Parameter:", oilName, "=>", columnName);

    let query = `
  SELECT
    Time_stamp,
    UUT_id,
    Test_id,
    [${columnName}] AS [${aliasName}]
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
      TRY_CONVERT(
        DATETIME,
        Time_stamp,
        103
      )
    `;

    console.log("Executing Query:");
    console.log(query);

    const result = await request.query(query);

    return result.recordset;
  } catch (error) {
    console.error(`Error Fetching ${oilName}`, error);

    throw error;
  }
}

export default {
  getOilData,
};
