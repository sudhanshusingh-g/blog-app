import express from "express";
import authentication from "../middlewares/authentication.js";
const router=express.Router();

import {createBlog,updateBlog,deleteBlog,readBlog,allBlogs} from "../controllers/blogController.js"

// routes
router.get("/", allBlogs);
router.get("/:id", readBlog);
router.post("/",authentication ,createBlog);
router.put("/:id", authentication,updateBlog);
router.delete("/:id", authentication,deleteBlog);

export default router;