import Blog from "../models/blog.js";
import User from "../models/user.js";

// all blog
async function allBlogs(req, res) {
  try {
    const all_blogs = await Blog.find()
      .populate("author", "name email image")
      .populate("comments.user", "name image");
    res.json({
      success: true,
      message: "All blogs fetched successfully",
      all_blogs,
    });
  } catch (error) {
    res.status(500).json({ error: "Error fetching blogs: " + error.message });
  }
}
// create blog function
async function createBlog(req, res) {
  try {
    const { title, body, tags, status } = req.body;
    const author = req.user;
    const authorUser = await User.findById(author._id);
    if (!authorUser) {
      return res.status(404).json({ error: "Author not found" });
    }

    const new_blog = new Blog({
      title,
      author,
      body,
      tags: tags || [],
      status: status || "active",
    });

    await new_blog.save();
    await authorUser.addBlog(new_blog._id);
    const populatedBlog = await Blog.findById(new_blog._id).populate(
      "author",
      "name image"
    );
    res.status(201).json({
      success: true,
      message: "Blog created successfully",
      blog: populatedBlog,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
// Read a blog with populated data
async function readBlog(req, res) {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate("author", "name email image")
      .populate("comments.user", "name image");

    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    res.status(200).json({ success: true, blog });
  } catch (error) {
    res.status(500).json({ error: error });
  }
}
// Update Blog
async function updateBlog(req, res) {
  try {
    const { title, body, tags, status } = req.body;
    const blogId = req.params.id;
    const user = req.user;

    if (!user) {
      return res
        .status(401)
        .json({ success: false, error: "Unauthorized request" });
    }

    // Find the blog by ID
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ success: false, error: "Blog not found" });
    }

    // Check if the user is the author of the blog
    if (blog.author.toString() !== user._id.toString()) {
      console.log(user._id);
      console.log(blog.author);
      return res
        .status(403)
        .json({ success: false, error: "Not authorized to update this blog" });
    }

    // If title is provided and different, check for duplicate (case-insensitive)
    if (title && title.toLowerCase() !== blog.title.toLowerCase()) {
      const existingBlog = await Blog.findOne({
        title: new RegExp(`^${title}$`, "i"),
      }).lean();
      if (existingBlog) {
        return res.status(409).json({
          success: false,
          error: "A blog with this title already exists",
        });
      }
    }

    // Ensure tags are formatted correctly
    const formattedTags = tags
      ? tags.map((tag) => tag.toLowerCase().trim())
      : blog.tags;

    // Validate and set status
    const validStatus = ["active", "inactive"].includes(status)
      ? status
      : blog.status;

    // Ensure at least one field is being updated
    if (!title && !body && !tags && !status) {
      return res
        .status(400)
        .json({ success: false, error: "No valid changes provided" });
    }

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
      success: true,
      message: "Blog updated successfully",
      blog: updatedBlog,
    });
  } catch (error) {
    console.error("Error updating blog:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
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
    if (blog.author.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ error: "You are not authorized to delete this blog" });
    }

    await blog.deleteOne(); // This triggers the pre-remove middleware

    res
      .status(200)
      .json({ success: true, message: "Blog deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Add comment to blog
async function addComment(req, res) {
  try {
    const { content } = req.body;
    const blogId = req.params.id;
    const user = req.user;

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    // Add comment and save
    await blog.addComment(user._id.toString(), content);

    // Populate only the comments field
    const updatedBlog = await Blog.findById(blogId).populate(
      "comments.user",
      "name image"
    );

    res.status(201).json({
      success: true,
      message: "Comment added successfully",
      comments: updatedBlog.comments, // Return only comments
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Get user's blogs
async function getUserBlogs(req, res) {
  try {
    const userId = req.params.userId || req.user._id;
    const blogs = await Blog.findByAuthor(userId);

    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export const toggleLike = async (req, res) => {
  try {
    const blogId = req.params.id;
    const user = req.user;

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    const hasLiked = blog.likedBy.includes(user._id);

    if (hasLiked) {
      // Unlike the blog
      blog.likedBy = blog.likedBy.filter(
        (id) => id.toString() !== user._id.toString()
      );
      blog.reactions -= 1;
    } else {
      // Like the blog
      blog.likedBy.push(user._id);
      blog.reactions += 1;
    }

    await blog.save();

    res.status(200).json({
      success: true,
      message: hasLiked ? "Like removed" : "Like added",
      reactions: blog.reactions,
      likedBy: blog.likedBy,
    });
  } catch (error) {
    res.status(500).json({ error: error.message || "Something went wrong" });
  }
};

export {
  createBlog,
  readBlog,
  updateBlog,
  deleteBlog,
  allBlogs,
  addComment,
  getUserBlogs,
};
