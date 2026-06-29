import express from "express";
import {
  getPublicProfile,
  addExperience,
  deleteExperience,
  addEducation,
  deleteEducation,
  endorseSkill,
  removeEndorsement,
} from "../controllers/profileController.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

router.post("/experience", authenticate, addExperience);
router.delete("/experience/:id", authenticate, deleteExperience);

router.post("/education", authenticate, addEducation);
router.delete("/education/:id", authenticate, deleteEducation);

router.post("/:id/endorse", authenticate, endorseSkill);
router.delete("/:id/endorse", authenticate, removeEndorsement);

// Keep the dynamic profile route last so it doesn't shadow the others.
router.get("/:id", authenticate, getPublicProfile);

export default router;
