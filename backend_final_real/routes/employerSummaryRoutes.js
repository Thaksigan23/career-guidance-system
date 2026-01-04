import express from "express";
import { getEmployerSummary } from "../controllers/employerSummaryController.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();
router.get("/summary", authenticate, getEmployerSummary);
export default router;
