import express from "express";
import { getRecommendations } from "../controllers/recommendation.controller.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

router.get("/", authenticate, getRecommendations);

export default router;
