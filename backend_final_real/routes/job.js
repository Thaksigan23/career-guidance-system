import express from "express";
import { postJob, getJobs, getJob, getEmployerJobs, updateJob, deleteJob } from "../controllers/jobController.js";
import { authenticate } from "../middleware/auth.js";
import { requireEmployer } from "../middleware/requireEmployer.js";

const router = express.Router();
router.get("/", getJobs);
router.get("/:id", getJob);
router.post("/", authenticate, requireEmployer, postJob);
router.get("/employer/my", authenticate, requireEmployer, getEmployerJobs);
router.put("/:id", authenticate, requireEmployer, updateJob);
router.delete("/:id", authenticate, requireEmployer, deleteJob);
export default router;
