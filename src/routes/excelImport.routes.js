/**
 * @file Excel Import Routes
 */
import express from "express";
import upload from "../config/upload.js";
import { importExcel } from "../services/excelImport.service.js";
const router = express.Router();
/**
 * Upload and Import Excel
 */
router.post("/import", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Excel file is required",
      });
    }
    const result = await importExcel(req.file.path, req.file.originalname);
    return res.status(200).json({
      success: true,
      message: "Excel imported successfully",
      data: result,
    });
  } catch (error) {
    console.error("Excel Import Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export default router;
