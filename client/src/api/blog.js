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
