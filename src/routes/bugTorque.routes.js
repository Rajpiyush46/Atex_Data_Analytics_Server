import express from "express";
import { getBUGTorqueData } from "../services/bugTorque.service.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const result = await getBUGTorqueData(req.body);

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
