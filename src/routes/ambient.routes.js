import express from "express";
import { getAmbientData } from "../services/ambient.service.js";

const router = express.Router();

router.post("/:ambientName", async (req, res) => {
  try {
    const { ambientName } = req.params;

    const result = await getAmbientData(ambientName, req.body);

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
