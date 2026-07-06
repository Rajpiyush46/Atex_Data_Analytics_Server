import express from "express";
import { getVTData } from "../services/vt.service.js";

const router = express.Router();

router.post("/:vtName", async (req, res) => {
  try {
    const { vtName } = req.params;

    const result = await getVTData(
      vtName.toUpperCase(),
      req.body
    );

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