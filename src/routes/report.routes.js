import express from "express";
import { getReportSummary } from "../services/report.service.js";

const router = express.Router();

router.get("/summary", async (req, res) => {
  try {
    const result = await getReportSummary();

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Report Route Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export default router;
