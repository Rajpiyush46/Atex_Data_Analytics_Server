import express from "express";
import { getBUGTorqueVibrationData } from "../services/bugTorqueVibration.service.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const data = await getBUGTorqueVibrationData(req.body);

    res.status(200).json({
      success: true,
      count: data.length,
      data,
    });
  } catch (error) {
    console.error(
      "BUG Torque vs Vibration Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to fetch BUG Torque vs Vibration data",
    });
  }
});

export default router;