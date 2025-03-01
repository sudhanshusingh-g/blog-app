import api from "../config/api";

export const allBlogs = async () => {
  try {
    const response = await api.get("/blogs/");
    return response.data;
  } catch (error) {
    console.error(error);
    return { error: true, message: "Failed to fetch blogs" };
  }
};

export const getBlog = async (id) => {
  try {
    const response = await api.get(`/blogs/${id}`);
    return response.data;
  } catch (error) {
    console.error(error);
    return { error: true, message: "Failed to fetch blogs" };
  }
};

export const addComment=async(blogId,content)=>{
  try {
    const response = await api.post(`/blogs/${blogId}/comments`, {content});
    return response.data;
    
  } catch (error) {
    console.error(error);
    return { error: true, message: "Failed to add comment" };
  }
}

export const toggleLike = async (id) => {
  try {
    const response = await api.post(`/blogs/${id}/like`);
    return response.data;
  } catch (error) {
    console.error(error);
    return { error: true, message: "Failed to like/unlike blog" };
  }
};


export const deleteBlog = async (id) => {
  try {
    const response = await api.delete(`/blogs/${id}`);
    return response.data;
  } catch (error) {
    console.error(
      "Error deleting blog:",
      error.response?.data || error.message
    );
    return {
      error: true,
      message: error.response?.data?.message || "Failed to delete blog",
    };
  }
};
export const updateBlog = async (id, blogData) => {
  try {
    const response = await api.put(`/blogs/${id}`, blogData);
    return response.data;
  } catch (error) {
    console.error(
      "Error updating blog:",
      error.response?.data || error.message
    );
    return {
      error: true,
      message: error.response?.data?.message || "Failed to update blog",
    };
  }
};

