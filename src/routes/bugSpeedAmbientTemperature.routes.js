import express from "express";
import { getBUGSpeedAmbientTemperatureData } from "../services/bugSpeedAmbientTemperature.service.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const data =
      await getBUGSpeedAmbientTemperatureData(req.body);

    res.status(200).json({
      success: true,
      count: data.length,
      data,
    });
  } catch (error) {
    console.error(
      "BUG Speed vs Ambient Temperature Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to fetch BUG Speed vs Ambient Temperature data",
    });
  }
});

export default router;
