import express from "express";
import { getCurrentData } from "../services/current.service.js";

const router = express.Router();

router.post("/:currentName", async (req, res) => {
  try {
    const { currentName } = req.params;

    const result = await getCurrentData(currentName, req.body);

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
