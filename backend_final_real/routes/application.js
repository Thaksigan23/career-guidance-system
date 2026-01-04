import express from "express";
import { 
  applyJob, 
  getApplicationsForJob, 
  getMyApplications, 
  getEmployerApplicants 
} from "../controllers/applicationController.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

// STUDENT APPLY TO JOB
router.post("/apply", authenticate, applyJob);

// EMPLOYER: Get applications for a specific job
router.get("/job/:job_id", authenticate, getApplicationsForJob);

// STUDENT: View my applications
router.get("/me", authenticate, getMyApplications);

// EMPLOYER: Get all applicants for all jobs
router.get("/employer/all", authenticate, getEmployerApplicants);

export default router;
