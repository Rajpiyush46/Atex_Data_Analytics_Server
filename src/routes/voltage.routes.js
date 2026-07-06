import express from "express";
import { getVoltageData } from "../services/voltage.service.js";

const router = express.Router();

router.post("/:voltageName", async (req, res) => {
  try {
    const { voltageName } = req.params;

    const result = await getVoltageData(voltageName, req.body);

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
