import express from "express";
import {
  postJob,
  getJobs,
  getJob,
  getEmployerJobs,
  updateJob,
  deleteJob
} from "../controllers/jobController.js";
import { authenticate } from "../middleware/auth.js";
import { requireEmployer } from "../middleware/requireEmployer.js";

const router = express.Router();

// PUBLIC
router.get("/", getJobs);

// EMPLOYER ROUTES (MUST COME FIRST)
router.get("/employer/my", authenticate, requireEmployer, getEmployerJobs);
router.post("/", authenticate, requireEmployer, postJob);
router.put("/:id", authenticate, requireEmployer, updateJob);
router.delete("/:id", authenticate, requireEmployer, deleteJob);

// GENERIC (KEEP LAST)
router.get("/:id", getJob);

export default router;
