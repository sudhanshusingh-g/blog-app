import Blog from "../models/blog.js";
import User from "../models/user.js";

// all blog
async function allBlogs(req, res) {
  try {
    const all_blogs = await Blog.find()
    .populate('author','name email image')
    .populate('comments.user','name image');
    res.json(all_blogs);
  } catch (error) {
    res.status(500).json({ error: "Error fetching blogs: " + error.message });
  }
}
// create blog function
async function createBlog(req, res) {
  try {
    const { title, body, tags, hidden, status } = req.body;
    const author = req.user.id;

    const existingBlog = await Blog.findOne({ title });

    if (existingBlog) {
      return res.status(409).json({ error: "Blog title already exists." });
    }
    const new_blog = new Blog({
      title,
      author,
      body,
      hidden: hidden || false,
      status: status || "draft",
      tags: tags || [],
      meta: {
        votes: 0,
        favs: 0,
      },
    });

    await new_blog.save();
    await new_blog.populate("author", "name email image");
    res.status(201).json({
      message: "Blog created successfully",
      blog: new_blog,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
// Read a blog with populated data
async function readBlog(req, res) {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate('author', 'name email image')
      .populate('comments.user', 'name image');

    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    res.status(200).json(blog);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
// Update blog
async function updateBlog(req, res) {
  try {
    const { title, body, tags, hidden, status } = req.body;
    const blogId = req.params.id;
    const userId = req.user.id; // From auth middleware

    // Find blog and check ownership
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    if (blog.author.toString() !== userId) {
      return res.status(403).json({ error: "Not authorized to update this blog" });
    }

    // If title is being updated, check for duplicates
    if (title && title !== blog.title) {
      const existingBlog = await Blog.findOne({ title });
      if (existingBlog) {
        return res.status(409).json({ error: "Blog title already exists" });
      }
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $set: {
          title: title || blog.title,
          body: body || blog.body,
          tags: tags || blog.tags,
          hidden: hidden !== undefined ? hidden : blog.hidden,
          status: status || blog.status
        }
      },
      { new: true, runValidators: true }
    ).populate('author', 'name email image');

    res.status(200).json({
      message: "Blog updated successfully",
      blog: updatedBlog
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
// Delete blog
async function deleteBlog(req, res) {
  try {
    const blogId = req.params.id;
    const userId = req.user.id; // From auth middleware

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    if (blog.author.toString() !== userId) {
      return res.status(403).json({ error: "Not authorized to delete this blog" });
    }

    await blog.remove(); // This triggers the pre-remove middleware

    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Add comment to blog
async function addComment(req, res) {
  try {
    const { content } = req.body;
    const blogId = req.params.id;
    const userId = req.user.id; // From auth middleware

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    await blog.addComment(userId, content);
    await blog.populate('comments.user', 'name image');

    res.status(201).json({
      message: "Comment added successfully",
      blog
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
// Publish blog
async function publishBlog(req, res) {
  try {
    const blogId = req.params.id;
    const userId = req.user.id; // From auth middleware

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    if (blog.author.toString() !== userId) {
      return res.status(403).json({ error: "Not authorized to publish this blog" });
    }

    await blog.publish();

    res.status(200).json({
      message: "Blog published successfully",
      blog
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
// Get user's blogs
async function getUserBlogs(req, res) {
  try {
    const userId = req.params.userId || req.user.id;
    const blogs = await Blog.findByAuthor(userId);

    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export { 
  createBlog, 
  readBlog, 
  updateBlog, 
  deleteBlog, 
  allBlogs,
  addComment,
  publishBlog,
  getUserBlogs
};