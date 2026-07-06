import express from "express";
import { getBUGTorqueOilOutTemperatureData } from "../services/bugTorqueOilOutTemperature.service.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const data = await getBUGTorqueOilOutTemperatureData(
      req.body
    );

    res.status(200).json({
      success: true,
      count: data.length,
      data,
    });
  } catch (error) {
    console.error(
      "BUG Torque vs Oil Out Temperature Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to fetch BUG Torque vs Oil Out Temperature data",
    });
  }
});

export default router;