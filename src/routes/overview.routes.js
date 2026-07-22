import express from "express";
import { getOverviewData } from "../services/overview.service.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const result = await getOverviewData(req.body);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Overview API Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export default router;
