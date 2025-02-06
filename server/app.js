import express from "express"
import mongoose from "mongoose";
import dotenv from "dotenv";
import Blog from "./models/blog.js";
import cors from "cors";
dotenv.config();


const app=express();
app.use(express.json());
app.use(cors());
const port=3000

try {
    mongoose.connect(process.env.MONGODB_URI);
    console.log(`MONGODB connected successfully.`);
} catch (error) {
    console.log(error);
}

// Home route
app.get('/',async(req,res)=>{
    try{
    const all_blogs=await Blog.find()
    res.json(all_blogs)
    }catch(error){
        res.status(500).send("Error fetching blogs")
    }
})


app.get("/api/blog/:id",readBlog);
app.post("/api/blog",createBlog);
app.put("/api/blog/:id", updateBlog);
app.delete("/api/blog/:id", deleteBlog);



// create blog function
async function createBlog(req,res){
    try {
        const existingBlog = await Blog.findOne({
          title: req.body.title,
          author: req.body.author,
        });

        if (existingBlog) {
          return res.status(409).json({ error: "Blog post already exists." });
        }
        const new_blog = new Blog({
          title: req.body.title,
          author: req.body.author,
          body: req.body.body,
          hidden: req.body.hidden || false,
          meta: {
            votes: req.body.meta?.votes || 0,
            favs: req.body.meta?.favs || 0,
          },
        });

        await new_blog.save();
        res.status(201).json(new_blog);
    }
    catch (error) {
        res.status(500).json({error:error.message})
    }
}

// Read a blog
async function readBlog(req,res){
    try {
        const active_blog=await Blog.findById(req.params.id)
    res.status(200).json(active_blog)
    } catch (error) {
        res.status(500).json({error:error.message})
    }

}

// update/edit blog function
async function updateBlog(req,res){
    try {
      const updatedBlog = await Blog.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true, runValidators: true }
      );
      res.status(200).json(updatedBlog);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
}

// Delete a blog
async function deleteBlog(req, res) {
  try {
    const activeBlog = await Blog.findByIdAndDelete(req.params.id);

    if (!activeBlog) {
      return res.status(404).json({ error: "Blog not found." });
    }

    res.status(200).json({ message: "Blog deleted successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


app.listen(port,()=>{
    console.log(`Server running at port :${port}`);
    
})