import express from "express";
import { authenticate } from "../middleware/auth.js";
import {
  applyJob,
  getMyApplications,
  getApplicationsForJob,
  getEmployerApplicants
} from "../controllers/applicationController.js";

const router = express.Router();

// Student applies for a job
router.post("/", authenticate, applyJob);

// Student view own applications
router.get("/me", authenticate, getMyApplications);

// Employer view applicants for a job
router.get("/job/:job_id", authenticate, getApplicationsForJob);

// Employer dashboard view
router.get("/employer", authenticate, getEmployerApplicants);

export default router;
