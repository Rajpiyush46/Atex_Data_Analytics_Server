import express from "express";
import { getTestAnalyticsDashboard } from "../services/testAnalytics.service.js";

const router = express.Router();

router.post("/dashboard", async (req, res) => {
  try {
    const result = await getTestAnalyticsDashboard(req.body);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Test Analytics Error", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export default router;