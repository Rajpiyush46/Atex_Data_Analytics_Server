import { getPool } from "../config/database.js";

export async function getMechanicalDashboard(filters) {
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
      SELECT
        Time_stamp,
        vibration
      FROM bug_test_data
      ${whereClause}
      ORDER BY Time_stamp
    `;

    const result = await request.query(query);

    const rows = result.recordset;

    const vibrationValues = rows
      .map((row) => Number(row.vibration))
      .filter((value) => !isNaN(value));

    if (!vibrationValues.length) {
      return {
        summary: {
          averageVibration: 0,
          peakVibration: 0,
          anomalies: 0,
          stdDeviation: 0,
        },
        trendData: [],
        peakData: [],
        distributionData: [],
        insight: {
          message: "No vibration data available.",
        },
      };
    }

    const averageVibration =
      vibrationValues.reduce((sum, value) => sum + value, 0) /
      vibrationValues.length;

    const peakVibration = Math.max(...vibrationValues);

    const variance =
      vibrationValues.reduce(
        (sum, value) =>
          sum + Math.pow(value - averageVibration, 2),
        0
      ) / vibrationValues.length;

    const stdDeviation = Math.sqrt(variance);

    const anomalyThreshold =
      averageVibration + 2 * stdDeviation;

    const anomalies = vibrationValues.filter(
      (value) => value > anomalyThreshold
    ).length;

    const trendData = rows.map((row) => ({
      time: row.Time_stamp,
      value: Number(row.vibration) || 0,
    }));

    const peakThreshold =
      averageVibration + 0.5 * stdDeviation;

    const peakData = vibrationValues
      .map((value, index) => ({
        sample: index + 1,
        value,
      }))
      .filter(
        (item) => item.value > peakThreshold
      );

    const histogram = {};

    vibrationValues.forEach((value) => {
      const bucket = (
        Math.floor(value / 0.2) * 0.2
      ).toFixed(1);

      histogram[bucket] =
        (histogram[bucket] || 0) + 1;
    });

    const distributionData = Object.entries(
      histogram
    )
      .map(([range, count]) => ({
        range,
        count,
      }))
      .sort(
        (a, b) =>
          parseFloat(a.range) -
          parseFloat(b.range)
      );

    const insight =
      anomalies > 0
        ? `Average vibration: ${averageVibration.toFixed(
            2
          )} mm/s. ${anomalies} vibration anomalies detected. ${peakData.length} significant peaks identified.`
        : `Average vibration: ${averageVibration.toFixed(
            2
          )} mm/s. No vibration anomalies detected — mechanical health appears normal. ${peakData.length} significant peaks identified.`;

    return {
      summary: {
        averageVibration: Number(
          averageVibration.toFixed(2)
        ),
        peakVibration: Number(
          peakVibration.toFixed(2)
        ),
        anomalies,
        stdDeviation: Number(
          stdDeviation.toFixed(2)
        ),
      },

      trendData,

      peakData,

      distributionData,

      insight: {
        message: insight,
      },
    };
  } catch (error) {
    console.error(
      "Error Fetching Mechanical Analytics",
      error
    );

    throw error;
  }
}

export default {
  getMechanicalDashboard,
};