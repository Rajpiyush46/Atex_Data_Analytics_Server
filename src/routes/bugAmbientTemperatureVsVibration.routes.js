import express from "express";
import { getBUGAmbientTemperatureVsVibrationData } from "../services/bugAmbientTemperatureVsVibration.service.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const data =
      await getBUGAmbientTemperatureVsVibrationData(
        req.body
      );

    res.status(200).json({
      success: true,
      count: data.length,
      data,
    });
  } catch (error) {
    console.error(
      "BUG Ambient Temperature vs Vibration Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to fetch BUG Ambient Temperature vs Vibration data",
    });
  }
});

export default router;