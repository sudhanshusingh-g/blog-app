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
router.post("/blogs/:id/comments", authentication, addComment);
router.post("/blogs/:id/publish", authentication, publishBlog);

router.put("/blogs/:id", authentication, updateBlog);
router.delete("/blogs/:id", authentication, deleteBlog);

export default router;
