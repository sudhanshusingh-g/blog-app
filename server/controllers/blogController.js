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
    const { title, body, tags } = req.body;
    const author = req.userId;
    const authorUser=await User.findById(author);
    if (!authorUser) {
      return res.status(404).json({ error: "Author not found" });
    }
    const existingBlog = await Blog.findOne({ title });

    if (existingBlog) {
      return res.status(409).json({ error: "Blog title already exists." });
    }
    const new_blog = new Blog({
      title,
      author,
      body,
      tags: tags || [],
    });

    await new_blog.save();
    await authorUser.addBlog(new_blog._id);
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
// Update Blog
async function updateBlog(req, res) {
  try {
    const { title, body, tags, status } = req.body;
    const blogId = req.params.id;
    const userId = req.userId; // From auth middleware

    // Find the blog by ID
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    // Check if the user is the author of the blog
    if (blog.author.toString() !== userId) {
      return res.status(403).json({ error: "Not authorized to update this blog" });
    }

    // If title is provided and different, check for duplicates
    if (title && title !== blog.title) {
      const existingBlog = await Blog.findOne({ title }).lean();
      if (existingBlog) {
        return res.status(409).json({ error: "A blog with this title already exists" });
      }
    }

    // Ensure tags are lowercase and trimmed
    const formattedTags = tags ? tags.map(tag => tag.toLowerCase().trim()) : blog.tags;

    // Ensure status is valid (optional, defaulting to existing)
    const validStatus = status && ["active", "inactive"].includes(status) ? status : blog.status;

    // Prepare update fields
    const updateFields = {
      ...(title && { title }),
      ...(body && { body }),
      ...(tags && { tags: formattedTags }),
      ...(status && { status: validStatus }),
    };

    // Update the blog and return the new document
    const updatedBlog = await Blog.findByIdAndUpdate(
      blogId,
      { $set: updateFields },
      { new: true, runValidators: true }
    ).populate("author", "name email image");

    res.status(200).json({
      message: "Blog updated successfully",
      blog: updatedBlog,
    });

  } catch (error) {
    console.error("Error updating blog:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Delete blog
async function deleteBlog(req, res) {
  try {
    const blogId = req.params.id;
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }
    // Check if the logged-in user is the author of the blog
    if (blog.author.toString() !== req.userId) {
      return res
        .status(403)
        .json({ error: "You are not authorized to delete this blog" });
    }

    await blog.deleteOne(); // This triggers the pre-remove middleware

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
    const userId = req.userId; // From auth middleware

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

export const toggleLike = async (req, res) => {
  try {
    const blogId = req.params.id;
    const userId = req.userId; // From authentication middleware

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    const hasLiked = blog.likedBy.includes(userId);

    if (hasLiked) {
      // Unlike the blog
      blog.likedBy = blog.likedBy.filter((id) => id.toString() !== userId);
      blog.reactions -= 1;
    } else {
      // Like the blog
      blog.likedBy.push(userId);
      blog.reactions += 1;
    }

    await blog.save();

    res.status(200).json({
      message: hasLiked ? "Like removed" : "Like added",
      reactions: blog.reactions,
      likedBy: blog.likedBy,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



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