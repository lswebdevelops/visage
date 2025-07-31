import express from "express";
import { addCommentToBlog } from "../controllers/blogController.js";


const router = express.Router();
import {
  getBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
} from "../controllers/blogController.js";

import { protect, admin } from "../middleware/authMiddleware.js";
import checkObjectId from "../middleware/checkObjectId.js";

router.route("/").get(getBlogs).post(protect, admin, createBlog);

router
  .route("/:id")
  .get(checkObjectId, getBlogById)
  .put(protect, admin, checkObjectId, updateBlog)
  .delete(protect, admin, checkObjectId, deleteBlog);
  
router.route("/:id/comments").post(protect, addCommentToBlog);

export default router;
