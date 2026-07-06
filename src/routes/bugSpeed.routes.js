import express from "express";
import { getBUGSpeedData } from "../services/bugSpeed.service.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const result = await getBUGSpeedData(req.body);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export default router;
