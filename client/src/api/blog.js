import api from "../config/api";

export const fetchBlogs = async () => {
  try {
    const response = await api.get("/blogs/");

    if (response.data.success) {
      return {
        success: true,
        message: response.data.message,
        blogs: response.data.all_blogs,
      };
    } else {
      return { success: false, message: "Failed to fetch blogs" };
    }
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.error || "Something went wrong",
    };
  }
};

// Fetch a single blog by ID
export const getBlog = async (id) => {
  try {
    const response = await api.get(`/blogs/${id}`);
    return {
      success: true,
      blog: response.data,
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.error || "Failed to fetch blog",
    };
  }
};
// Add a comment to a blog
export const addComment = async (blogId, content) => {
  try {
    const response = await api.post(`/blogs/${blogId}/comments`, { content });

    return {
      success: true,
      message: response.data.message || "Comment added successfully",
      comment: response.data.comment || null, // Ensure the comment field exists
    };
  } catch (error) {
    console.error("Error adding comment:", error.response?.data || error.message);

    return {
      success: false,
      message: error.response?.data?.error || "Failed to add comment",
      comment: null,
    };
  }
};


export const toggleLike = async (id) => {
  try {
    const response = await api.post(`/blogs/${id}/like`);

    return {
      success: true,
      message: response.data.message || "Like toggled successfully",
      reactions: response.data.reactions || 0,
      likedBy: response.data.likedBy || [], // Ensuring data is always returned
    };
  } catch (error) {
    console.error(
      "Error toggling like:",
      error.response?.data || error.message
    );

    return {
      success: false,
      message: error.response?.data?.error || "Failed to like/unlike blog",
      reactions: 0,
      likedBy: [],
    };
  }
};



export const deleteBlog = async (id) => {
  try {
    const response = await api.delete(`/blogs/${id}`);

    if (response.data.success) {
      return {
        success: true,
        message: response.data.message || "Blog deleted successfully",
      };
    } else {
      return {
        success: false,
        message: response.data.error || "Failed to delete blog",
      };
    }
  } catch (error) {
    console.error(
      "Error deleting blog:",
      error.response?.data || error.message
    );

    return {
      success: false,
      message:
        error.response?.data?.error ||
        "Something went wrong while deleting the blog",
    };
  }
};

export const updateBlog = async (id, blogData) => {
  try {
    const response = await api.put(`/blogs/${id}`, blogData);

    if (response.data.success) {
      return {
        success: true,
        message: response.data.message || "Blog updated successfully",
        blog: response.data.blog,
      };
    } else {
      return {
        success: false,
        message: response.data.error || "Failed to update blog",
      };
    }
  } catch (error) {
    console.error(
      "Error updating blog:",
      error.response?.data || error.message
    );

    return {
      success: false,
      message:
        error.response?.data?.error ||
        "Something went wrong while updating the blog",
    };
  }
};


// Create a new blog
export const createBlog = async (blogData) => {
  try {
    const response = await api.post("/blogs/", blogData);
    if (response.data.success) {
      return {
        success: true,
        message: response.data.message,
        blog: response.data.blog,
      };
    } else {
      return { success: false, message: "Failed to get blog" };
    }
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.error || "Something went wrong",
    };
  }
};