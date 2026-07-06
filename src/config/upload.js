/**
 * @file File Upload Configuration
 *
 * Handles:
 * - Upload directory creation
 * - Excel file validation
 * - File size validation
 * - Custom file naming
 */
import multer from "multer";
import fs from "fs";
import path from "path";

/**
 * Upload directory path
 *
 * Example:
 * server/uploads
 */
const uploadPath = path.join(process.cwd(), "uploads");

/**
 * Create uploads directory if it doesn't exist
 */
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, {
    recursive: true,
  });
  console.log(" uploads folder created");
}

/**
 * Multer storage configuration
 */
const storage = multer.diskStorage({
  /**
   * Upload destination
   */
  destination(req, file, cb) {
    cb(null, uploadPath);
  },

  /**
   * Custom file name
   *
   * Example:
   * ExcelUpload_20260701_170210.xlsx
   */
  filename(req, file, cb) {
    const now = new Date();

    const timestamp =
      now.getFullYear() +
      String(now.getMonth() + 1).padStart(2, "0") +
      String(now.getDate()).padStart(2, "0") +
      "_" +
      String(now.getHours()).padStart(2, "0") +
      String(now.getMinutes()).padStart(2, "0") +
      String(now.getSeconds()).padStart(2, "0");

    const extension = path.extname(file.originalname);

    const fileName = `ExcelUpload_${timestamp}${extension}`;

    cb(null, fileName);
  },
});

/**
 * Multer middleware
 */
const upload = multer({
  storage,

  /**
   * Maximum file size
   * 100 MB
   */
  limits: {
    fileSize: 100 * 1024 * 1024,
  },

  /**
   * Allow only Excel files
   */
  fileFilter(req, file, cb) {
    const allowedExtensions = [".xlsx", ".xls"];
    const extension = path.extname(file.originalname).toLowerCase();
    if (!allowedExtensions.includes(extension)) {
      return cb(new Error("Only Excel (.xlsx, .xls) files are allowed"));
    }
    cb(null, true);
  },
});

export default upload;
