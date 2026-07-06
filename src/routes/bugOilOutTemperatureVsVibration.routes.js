import express from "express";
import { getBUGOilOutTemperatureVsVibrationData } from "../services/bugOilOutTemperatureVsVibration.service.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const data =
      await getBUGOilOutTemperatureVsVibrationData(
        req.body
      );

    res.status(200).json({
      success: true,
      count: data.length,
      data,
    });
  } catch (error) {
    console.error(
      "BUG Oil Out Temperature vs Vibration Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to fetch BUG Oil Out Temperature vs Vibration data",
    });
  }
});

export default router;