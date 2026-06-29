import express from "express";
import multer from "multer";
import { authenticate } from "../middleware/auth.js";
import { analyzeCV, getCVHistory, downloadCVReport } from "../controllers/cvController.js";

const router = express.Router();

// multer config
const upload = multer({ dest: "uploads/" });

// ✅ CV ANALYSIS
router.post(
  "/analyze",
  authenticate,
  upload.single("cv"),
  analyzeCV
);

// ✅ CV ANALYSIS HISTORY
router.get("/history", authenticate, getCVHistory);
router.get("/download", authenticate, downloadCVReport);

export default router;
