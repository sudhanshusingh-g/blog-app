import express from "express";
import {
  createBlog,
  readBlog,
  updateBlog,
  deleteBlog,
  allBlogs,
  addComment,
  publishBlog,
  getUserBlogs,
} from "../controllers/blogController.js";
import authentication from "../middlewares/authentication.js";

const router = express.Router();

router.get("/", allBlogs);
router.get("/:id", readBlog);
router.get("/user/blogs", authentication, getUserBlogs);
router.get("/user/:userId/blogs", getUserBlogs);

router.post("/", authentication, createBlog);
router.post("/:id/comments", authentication, addComment);
router.post("/:id/publish", authentication, publishBlog);

router.put("/:id", authentication, updateBlog);
router.delete("/:id", authentication, deleteBlog);

export default router;
