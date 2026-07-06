import express from "express";
import { getBUGOilInPressureVsOilOutPressureData } from "../services/bugOilInPressureVsOilOutPressure.service.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const data =
      await getBUGOilInPressureVsOilOutPressureData(
        req.body
      );

    res.status(200).json({
      success: true,
      count: data.length,
      data,
    });
  } catch (error) {
    console.error(
      "BUG Oil In Pressure vs Oil Out Pressure Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to fetch BUG Oil In Pressure vs Oil Out Pressure data",
    });
  }
});

export default router;