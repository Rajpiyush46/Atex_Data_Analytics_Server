import express from "express";
import { getBUGOilOutFlowVsOilOutTemperatureData } from "../services/bugOilOutFlowVsOilOutTemperature.service.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const data =
      await getBUGOilOutFlowVsOilOutTemperatureData(
        req.body
      );

    res.status(200).json({
      success: true,
      count: data.length,
      data,
    });
  } catch (error) {
    console.error(
      "BUG Oil Out Flow vs Oil Out Temperature Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to fetch BUG Oil Out Flow vs Oil Out Temperature data",
    });
  }
});

export default router;