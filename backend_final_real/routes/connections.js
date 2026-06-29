import express from "express";
import {
  sendRequest,
  respondRequest,
  removeConnection,
  listConnections,
  listPending,
  suggestions,
  getStatus,
} from "../controllers/connectionController.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

router.get("/", authenticate, listConnections);
router.get("/pending", authenticate, listPending);
router.get("/suggestions", authenticate, suggestions);
router.get("/status/:id", authenticate, getStatus);

router.post("/request/:id", authenticate, sendRequest);
router.post("/respond/:id", authenticate, respondRequest);
router.delete("/:id", authenticate, removeConnection);

export default router;
