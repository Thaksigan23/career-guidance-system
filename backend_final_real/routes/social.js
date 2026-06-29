import express from "express";
import {
  createPost,
  getFeed,
  deletePost,
  likePost,
  unlikePost,
  getComments,
  addComment,
} from "../controllers/socialController.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

router.get("/feed", authenticate, getFeed);
router.post("/posts", authenticate, createPost);
router.delete("/posts/:id", authenticate, deletePost);

router.post("/posts/:id/like", authenticate, likePost);
router.delete("/posts/:id/like", authenticate, unlikePost);

router.get("/posts/:id/comments", authenticate, getComments);
router.post("/posts/:id/comments", authenticate, addComment);

export default router;
