import express from "express";
import { authenticate } from "../middleware/auth.js";
import { getCareerPath } from "../controllers/careerController.js";

const router = express.Router();

router.post("/recommend", authenticate, getCareerPath);

export default router;
