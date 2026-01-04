import express from "express";
import { authenticate } from "../middleware/auth.js";
import { saveJob, getSavedJobs, removeSavedJob } from "../controllers/savedController.js";

const router = express.Router();

// Save job
router.post("/save", authenticate, saveJob);

// Get saved jobs
router.get("/me", authenticate, getSavedJobs);

// Remove saved job
router.delete("/:saved_id", authenticate, removeSavedJob);

export default router;
