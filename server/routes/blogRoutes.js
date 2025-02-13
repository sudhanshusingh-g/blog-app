import express from "express";
import authentication from "../middlewares/authentication.js";
const router=express.Router();

import {createBlog,updateBlog,deleteBlog,readBlog,allBlogs} from "../controllers/blogController.js"

// routes
router.get("/", allBlogs);
router.get("/:id", readBlog);
router.post("/", createBlog);
router.put("/:id", updateBlog);
router.delete("/:id", deleteBlog);

export default router;