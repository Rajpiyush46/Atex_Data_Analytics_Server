import express from "express";
import { getBUGSpeedVibrationData } from "../services/bugSpeedVibration.service.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const data = await getBUGSpeedVibrationData(req.body);

    res.status(200).json({
      success: true,
      count: data.length,
      data,
    });
  } catch (error) {
    console.error(
      "BUG Speed vs Vibration Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to fetch BUG Speed vs Vibration data",
    });
  }
});

export default router;