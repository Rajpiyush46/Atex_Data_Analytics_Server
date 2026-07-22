import { getPool } from "../config/database.js";

export async function getTestAnalyticsDashboard(filters) {
  try {
    const { fromDate, toDate } = filters || {};

    const pool = getPool();

    let whereClause = " WHERE 1=1 ";

    const request = pool.request();

    if (fromDate && toDate) {
      whereClause += `
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

    const query = `
      SELECT *
      FROM bug_test_data
      ${whereClause}
    `;

    const result = await request.query(query);

    const rows = result.recordset;

    console.log("FIRST ROW", rows[0]);

    const totalTests = rows.length;

    const passCount = rows.filter(
      (r) =>
        String(r.test_status)
          .toUpperCase()
          .includes("PASS")
    ).length;

    const passRate =
      totalTests > 0
        ? Number(
            (
              (passCount / totalTests) *
              100
            ).toFixed(2)
          )
        : 0;

    const failRate = Number(
      (100 - passRate).toFixed(2)
    );

    const uniqueOperators = [
      ...new Set(
        rows
          .map((r) => r.operator_name)
          .filter(Boolean)
      ),
    ];

    const uniqueConditions = [
      ...new Set(
        rows
          .map((r) => r.Test_condition)
          .filter(Boolean)
      ),
    ];

    const uniqueModes = [
      ...new Set(
        rows
          .map((r) => r.Operating_mode)
          .filter(Boolean)
      ),
    ];

    const uniqueUuts = [
      ...new Set(
        rows
          .map((r) => r.UUT_id)
          .filter(Boolean)
      ),
    ];

    const statusDistribution =
      buildDistribution(
        rows,
        "test_status"
      );

    const operatorActivity =
      buildDistribution(
        rows,
        "operator_name"
      );

    const testConditions =
      buildDistribution(
        rows,
        "Test_condition"
      );

    const operatingModes =
      buildDistribution(
        rows,
        "Operating_mode"
      );

    const operatorPerformance =
      buildPassRateAnalysis(
        rows,
        "operator_name"
      );

    const conditionPerformance =
      buildPassRateAnalysis(
        rows,
        "Test_condition"
      );

    return {
      summary: {
        totalTests,
        passRate,
        failRate,
        operators:
          uniqueOperators.length,
        conditions:
          uniqueConditions.length,
        operatingModes:
          uniqueModes.length,
        uutUnits:
          uniqueUuts.length,
      },

      metadata: {
        uniqueUuts:
          uniqueUuts.length,
        testSessions:
          totalTests,
        dataPoints:
          totalTests *
          Object.keys(
            rows[0] || {}
          ).length,
      },

      statusDistribution,

      operatorActivity,

      testConditions,

      operatingModes,

      operatorPerformance,

      conditionPerformance,
    };
  } catch (error) {
    console.error(
      "Error Fetching Test Analytics",
      error
    );

    throw error;
  }
}

function buildDistribution(
  rows,
  field
) {
  const map = {};

  rows.forEach((row) => {
    const value =
      row[field] || "Unknown";

    map[value] =
      (map[value] || 0) + 1;
  });

  return Object.entries(map)
    .map(([name, value]) => ({
      name,
      value,
    }))
    .sort(
      (a, b) => b.value - a.value
    );
}

function buildPassRateAnalysis(
  rows,
  field
) {
  const stats = {};

  rows.forEach((row) => {
    const key =
      row[field] || "Unknown";

    if (!stats[key]) {
      stats[key] = {
        pass: 0,
        total: 0,
      };
    }

    stats[key].total++;

    if (
      String(
        row.test_status
      ).toUpperCase() === "PASS"
    ) {
      stats[key].pass++;
    }
  });

  return Object.entries(stats)
    .map(([name, stat]) => ({
      name,
      passRate: Number(
        (
          (stat.pass /
            stat.total) *
          100
        ).toFixed(2)
      ),
      tests: stat.total,
    }))
    .sort(
      (a, b) =>
        b.passRate - a.passRate
    );
}

export default {
  getTestAnalyticsDashboard,
};
