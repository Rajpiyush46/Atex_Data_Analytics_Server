import express from "express";
import { getComparisonData } from "../services/comparison.service.js";

const router = express.Router();

/**
 * Comparison API
 *
 * Examples:
 *
 * 1. All Data
 * {
 *   "xParameter": "VT1",
 *   "yParameter": "BUG_Speed"
 * }
 *
 * 2. Single Date
 * {
 *   "xParameter": "VT1",
 *   "yParameter": "BUG_Speed",
 *   "fromDate": "2026-07-01"
 * }
 *
 * 3. Date Range
 * {
 *   "xParameter": "VT1",
 *   "yParameter": "BUG_Speed",
 *   "fromDate": "2026-07-01",
 *   "toDate": "2026-07-14"
 * }
 *
 * 4. Date + Time Range
 * {
 *   "xParameter": "VT1",
 *   "yParameter": "BUG_Speed",
 *   "fromDate": "2026-07-01",
 *   "toDate": "2026-07-14",
 *   "fromTime": "08:00:00",
 *   "toTime": "18:00:00"
 * }
 */

router.post("/", async (req, res) => {
  try {
    const { xParameter, yParameter } = req.body;

    /**
     * Validation
     */
    if (!xParameter || !yParameter) {
      return res.status(400).json({
        success: false,
        message: "xParameter and yParameter are required",
      });
    }

    const result = await getComparisonData(req.body);

    return res.status(200).json({
      success: true,
      message: "Comparison data fetched successfully",
      totalRecords: result.length,
      data: result,
    });
  } catch (error) {
    console.error("Comparison API Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export default router;
