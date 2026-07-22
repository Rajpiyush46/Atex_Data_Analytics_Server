/**
 * @file excelImport.service.js
 *
 * Handles:
 * - Excel file reading
 * - Excel validation
 * - SQL Server data import
 * - Import history logging
 */

import XLSX from "xlsx";
import { getPool } from "../config/database.js";

/**
 * Import Excel Data
 *
 * @param {string} filePath
 * @param {string} originalFileName
 *
 * @returns {Object}
 */
export async function importExcel(filePath, originalFileName) {
  try {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
    if (!rows.length) {
      throw new Error("Excel file is empty");
    }
    const pool = getPool();
    // delete
    await pool.request().query(`
  DELETE FROM bug_test_data
`);

    let importedRows = 0;
    for (const row of rows) {
      let timeStamp = row["Time_stamp"];
 // to fromat the date time conersion second 130 econd converted to minutes >> piyush
      if (timeStamp) {
        const parts = String(timeStamp).split("-");

        if (parts.length === 4) {
          const day = Number(parts[0]);
          const month = Number(parts[1]);
          const year = Number(parts[2]);

          const timeParts = parts[3].split(":");

          const hours = Number(timeParts[0]);
          const minutes = Number(timeParts[1]);
          const seconds = Number(timeParts[2]);
          const totalSeconds = hours * 3600 + minutes * 60 + seconds;

          const finalHours = Math.floor(totalSeconds / 3600);

          const remainingSeconds = totalSeconds % 3600;

          const finalMinutes = Math.floor(remainingSeconds / 60);

          const finalSeconds = remainingSeconds % 60;

          timeStamp =
            `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")} ` +
            `${String(finalHours).padStart(2, "0")}:${String(finalMinutes).padStart(2, "0")}:${String(finalSeconds).padStart(2, "0")}`;
        }
      }

      console.log("Converted:", timeStamp);

      await pool
        .request()

        .input("Time_stamp", timeStamp ?? null)
        .input("UUT_id", row["UUT_id"] ?? null)
        .input("operator_name", row["operator name"] ?? null)
        .input("Test_id", row["Test_id"] ?? null)
        .input("Test_condition", row["Test_condition"] ?? null)
        .input("Operating_mode", row["Operating_mode"] ?? null)

        .input("VT1", row["VT1(V)"] ?? null)
        .input("VT2", row["VT2(V)"] ?? null)
        .input("VT3", row["VT3(V)"] ?? null)
        .input("VT4", row["VT4(V)"] ?? null)
        .input("VT5", row["VT5(V)"] ?? null)
        .input("VT6", row["VT6(V)"] ?? null)
        .input("VT7", row["VT7(V)"] ?? null)
        .input("VT8", row["VT8(V)"] ?? null)
        .input("VT9", row["VT9(V)"] ?? null)

        .input("Voltage1", row["Voltage1(T1-T2)"] ?? null)
        .input("Voltage2", row["Voltage2(T2-T3)"] ?? null)
        .input("Voltage3", row["Voltage3(T3-T1)"] ?? null)

        .input("Current1", row["Current1(T1-T2)"] ?? null)
        .input("Current2", row["Current2(T2-T3)"] ?? null)
        .input("Current3", row["Current3(T3-T1)"] ?? null)

        .input("Ambient_humidity", row["Ambient humidity"] ?? null)
        .input("Ambient_temperature", row["Ambient temperature"] ?? null)
        .input("Ambient_pressure", row["Ambient Pressure"] ?? null)

        .input("BUG_Speed", row["BUG Speed"] ?? null)
        .input("BUG_Torque", row["BUG Torque"] ?? null)

        .input("BUG_Oil_in_Pressure", row["BUG Oil in Pressure"] ?? null)
        .input("BUG_Oil_Out_Pressure", row["BUG Oil Out Pressure"] ?? null)

        .input("BUG_Oil_in_Temperature", row["BUG Oil in Temperature"] ?? null)
        .input(
          "BUG_Oil_Out_Temperature",
          row["BUG Oil Out Temperature"] ?? null
        )

        .input("BUG_Oil_Out_Flow", row["BUG Oil Out Flow"] ?? null)

        .input("vibration", row["vibration"] ?? null)

        .input("test_status", row["test_status"] ?? null).query(`
      INSERT INTO bug_test_data (

        Time_stamp,
        UUT_id,
        operator_name,
        Test_id,
        Test_condition,
        Operating_mode,

        VT1,
        VT2,
        VT3,
        VT4,
        VT5,
        VT6,
        VT7,
        VT8,
        VT9,

        Voltage1,
        Voltage2,
        Voltage3,

        Current1,
        Current2,
        Current3,

        Ambient_humidity,
        Ambient_temperature,
        Ambient_pressure,

        BUG_Speed,
        BUG_Torque,

        BUG_Oil_in_Pressure,
        BUG_Oil_Out_Pressure,

        BUG_Oil_in_Temperature,
        BUG_Oil_Out_Temperature,

        BUG_Oil_Out_Flow,

        vibration,
        test_status

      )
      VALUES (

        @Time_stamp,
        @UUT_id,
        @operator_name,
        @Test_id,
        @Test_condition,
        @Operating_mode,

        @VT1,
        @VT2,
        @VT3,
        @VT4,
        @VT5,
        @VT6,
        @VT7,
        @VT8,
        @VT9,

        @Voltage1,
        @Voltage2,
        @Voltage3,

        @Current1,
        @Current2,
        @Current3,

        @Ambient_humidity,
        @Ambient_temperature,
        @Ambient_pressure,

        @BUG_Speed,
        @BUG_Torque,

        @BUG_Oil_in_Pressure,
        @BUG_Oil_Out_Pressure,

        @BUG_Oil_in_Temperature,
        @BUG_Oil_Out_Temperature,

        @BUG_Oil_Out_Flow,

        @vibration,
        @test_status
      )
    `);

      importedRows++;
    }

    /**
     * Save Import History
     */
    await pool
      .request()
      .input("file_name", originalFileName)
      .input("total_rows", rows.length)
      .input("imported_rows", importedRows).query(`
        INSERT INTO import_logs (
          file_name,
          total_rows,
          imported_rows,
          status
        )
        VALUES (
          @file_name,
          @total_rows,
          @imported_rows,
          'SUCCESS'
        )
      `);

    console.log(`✅ ${importedRows} rows imported successfully`);

    return {
      success: true,
      fileName: originalFileName,
      totalRows: rows.length,
      importedRows,
      status: "SUCCESS",
    };
  } catch (error) {
    console.error("❌ Excel Import Failed");

    console.error(error);

    throw error;
  }
}

/**
 * Default Export
 */
export default {
  importExcel,
};
