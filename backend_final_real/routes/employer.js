import express from "express";
import { getProfile, updateProfile } from "../controllers/employerController.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();
router.get("/me", authenticate, getProfile);
router.post("/me", authenticate, updateProfile);
export default router;
