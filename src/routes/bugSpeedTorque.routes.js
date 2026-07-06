import express from "express";
import { getBUGSpeedTorqueData } from "../services/bugSpeedTorque.service.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const data = await getBUGSpeedTorqueData(req.body);

    res.status(200).json({
      success: true,
      count: data.length,
      data,
    });
  } catch (error) {
    console.error("BUG Speed vs Torque Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch BUG Speed vs Torque data",
    });
  }
});

export default router;