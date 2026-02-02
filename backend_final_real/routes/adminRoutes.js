import express from "express";
import { authenticate } from "../middleware/auth.js";
import isAdmin from "../middleware/isAdmin.js";
import {
  getAllUsers,
  blockUser,
  unblockUser,
  deleteUser,
  getAllJobs,
  approveJob,
  rejectJob,
} from "../controllers/adminController.js";

const router = express.Router();

// USERS
router.get("/users", authenticate, isAdmin, getAllUsers);
router.put("/users/:id/block", authenticate, isAdmin, blockUser);
router.put("/users/:id/unblock", authenticate, isAdmin, unblockUser);
router.delete("/users/:id", authenticate, isAdmin, deleteUser);

// JOBS
router.get("/jobs", authenticate, isAdmin, getAllJobs);
router.put("/jobs/:id/approve", authenticate, isAdmin, approveJob);
router.put("/jobs/:id/reject", authenticate, isAdmin, rejectJob);

export default router;
