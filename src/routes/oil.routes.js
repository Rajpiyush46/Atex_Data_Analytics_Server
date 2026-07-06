import express from "express";
import { getOilData } from "../services/oil.service.js";

const router = express.Router();

router.post("/:oilName", async (req, res) => {
  try {
    const { oilName } = req.params;

    const result = await getOilData(oilName, req.body);

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
