
import { getPool } from "../config/database.js";

export async function getOverviewData() {
  try {
    const pool = getPool();

    const result = await pool.request().query(`
      SELECT
        Time_stamp,
        UUT_id,
        Test_id,
        Voltage1,
        Voltage2,
        Voltage3,
        Current1,
        Current2,
        Current3,
        Ambient_temperature,
        BUG_Speed,
        BUG_Torque,
        vibration,
        test_status
      FROM bug_test_data
      ORDER BY Time_stamp
    `);

    const rows = result.recordset || [];

    console.log("================================");
    console.log("ROWS FOUND:", rows.length);

    if (rows.length > 0) {
      console.log("FIRST ROW:", rows[0]);
    }
    console.log("================================");

    const totalRecords = rows.length;

    const getAverage = (data, column) => {
      const values = data
        .map((row) => Number(row[column]))
        .filter((value) => !isNaN(value));

      if (!values.length) {
        return 0;
      }

      return values.reduce((a, b) => a + b, 0) / values.length;
    };

    const avgSpeed = getAverage(rows, "BUG_Speed");
    const avgTorque = getAverage(rows, "BUG_Torque");
    const avgVibration = getAverage(rows, "vibration");
    const avgTemperature = getAverage(rows, "Ambient_temperature");

    const avgVoltage =
      (getAverage(rows, "Voltage1") + getAverage(rows, "Voltage2")) / 2;

    const avgCurrent =
      (getAverage(rows, "Current1") + getAverage(rows, "Current2")) / 2;

    const passCount = rows.filter(
      (row) => String(row.test_status || "").toUpperCase() === "PASS"
    ).length;

    const passPercent =
      totalRecords > 0 ? Math.round((passCount / totalRecords) * 100) : 0;

    const failPercent = 100 - passPercent;

    const healthScore = passPercent;

    const speedChart = rows.map((row, index) => ({
      index: index + 1,
      value: Number(row.BUG_Speed) || 0,
    }));

    const torqueChart = rows.map((row, index) => ({
      index: index + 1,
      value: Number(row.BUG_Torque) || 0,
    }));

    const vibrationChart = rows.map((row, index) => ({
      index: index + 1,
      value: Number(row.vibration) || 0,
    }));

    const voltageChart = rows.map((row, index) => ({
      index: index + 1,
      value: ((Number(row.Voltage1) || 0) + (Number(row.Voltage2) || 0)) / 2,
    }));

    const temperatureChart = rows.map((row, index) => ({
      index: index + 1,
      value: Number(row.Ambient_temperature) || 0,
    }));

    const statusMap = {};

    rows.forEach((row) => {
      const status = row.test_status || "UNKNOWN";

      statusMap[status] = (statusMap[status] || 0) + 1;
    });

    const statusDistribution = Object.entries(statusMap).map(
      ([name, value]) => ({
        name,
        value,
      })
    );

    return {
      healthScore,
      passPercent,
      failPercent,
      totalRecords,

      parameterCount: 26,

      insight: `Generator health score is ${healthScore}/100. ${passPercent}% of tests passed successfully. Analysed ${totalRecords} records.`,

      kpis: [
        {
          label: "BUG SPEED",
          value: (avgSpeed / 1000).toFixed(1),
          unit: "K RPM",
        },
        {
          label: "BUG TORQUE",
          value: avgTorque.toFixed(2),
          unit: "Nm",
        },
        {
          label: "VIBRATION",
          value: avgVibration.toFixed(2),
          unit: "mm/s",
        },
        {
          label: "VOLTAGE(T1-T2)",
          value: avgVoltage.toFixed(2),
          unit: "V",
        },
        {
          label: "CURRENT(T1-T2)",
          value: avgCurrent.toFixed(2),
          unit: "A",
        },
        {
          label: "AMBIENT TEMPERATURE",
          value: avgTemperature.toFixed(2),
          unit: "°C",
        },
        {
          label: "PASS RATE",
          value: passPercent,
          unit: "%",
        },
        {
          label: "FAIL RATE",
          value: failPercent,
          unit: "%",
        },
      ],

      chartCards: [
        {
          title: "BUG Speed",
          description: "Generator rotational speed",
          dataKey: "value",
          unit: "RPM",
          color: "#F59E0B",
          avg: avgSpeed,
          min: Math.min(...speedChart.map((d) => d.value)),
          max: Math.max(...speedChart.map((d) => d.value)),
          variance: 0,
          data: speedChart,
        },
        {
          title: "BUG Torque",
          description: "Generator torque",
          dataKey: "value",
          unit: "Nm",
          color: "#D97706",
          avg: avgTorque,
          min: Math.min(...torqueChart.map((d) => d.value)),
          max: Math.max(...torqueChart.map((d) => d.value)),
          variance: 0,
          data: torqueChart,
        },
        {
          title: "Voltage(T1-T2)",
          description: "Voltage trend",
          dataKey: "value",
          unit: "V",
          color: "#8B5CF6",
          avg: avgVoltage,
          min: Math.min(...voltageChart.map((d) => d.value)),
          max: Math.max(...voltageChart.map((d) => d.value)),
          variance: 0,
          data: voltageChart,
        },
        {
          title: "Vibration",
          description: "Vibration trend",
          dataKey: "value",
          unit: "mm/s",
          color: "#6366F1",
          avg: avgVibration,
          min: Math.min(...vibrationChart.map((d) => d.value)),
          max: Math.max(...vibrationChart.map((d) => d.value)),
          variance: 0,
          data: vibrationChart,
        },
        {
          title: "Ambient Temperature",
          description: "Ambient temperature trend",
          dataKey: "value",
          unit: "°C",
          color: "#10B981",
          avg: avgTemperature,
          min: Math.min(...temperatureChart.map((d) => d.value)),
          max: Math.max(...temperatureChart.map((d) => d.value)),
          variance: 0,
          data: temperatureChart,
        },
      ],

      statusDistribution,
    };
  } catch (error) {
    console.error("Error Fetching Overview Data", error);
    throw error;
  }
}

export default {
  getOverviewData,
};
