import express from "express";
import { authenticate } from "../middleware/auth.js";
import {
  saveJob,
  getSavedJobs,
  removeSavedJob
} from "../controllers/savedController.js";

const router = express.Router();

router.post("/", authenticate, saveJob);
router.get("/", authenticate, getSavedJobs);
router.delete("/:id", authenticate, removeSavedJob);

export default router;
