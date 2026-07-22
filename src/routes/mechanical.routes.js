import express from "express";
import { getMechanicalDashboard } from "../services/mechanical.service.js";

const router = express.Router();

router.post("/dashboard", async (req, res) => {
  try {
    const result = await getMechanicalDashboard(req.body);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Mechanical Analytics Error", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export default router;