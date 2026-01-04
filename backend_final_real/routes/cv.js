import express from "express";
import multer from "multer";
import { analyzeCV } from "../controllers/cvController.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/analyze", upload.single("cv"), analyzeCV);

export default router;
