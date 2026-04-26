import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import {
  getProfile,
  updateProfile,
  uploadProfileCV,
  deleteProfileCV,
} from "../controllers/studentController.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

const cvUploadDir = path.resolve(process.cwd(), "uploads", "profile-cvs");
fs.mkdirSync(cvUploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, cvUploadDir),
  filename: (_req, file, cb) => {
    const safeName = file.originalname.replace(/\s+/g, "_");
    cb(null, `${Date.now()}_${safeName}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (allowed.includes(file.mimetype)) return cb(null, true);
    return cb(new Error("Only PDF, DOC, and DOCX files are allowed"));
  },
});

router.get("/me", authenticate, getProfile);
router.post("/me", authenticate, updateProfile);
router.post("/me/cv", authenticate, upload.single("cv"), uploadProfileCV);
router.delete("/me/cv", authenticate, deleteProfileCV);
export default router;
