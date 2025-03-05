import React, { useState } from "react";
import { createBlog } from "../api/blog";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../redux/slices/userSlice";
import { useNavigate } from "react-router-dom";
import { setBlog } from "../redux/slices/blogSlice";

function PostBlog() {
  const [formData, setFormData] = useState({
    title: "",
    body: "",
    status: "active",
    tags: [],
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const { user } = useSelector((state) => state.user);
  const { blog } = useSelector((state) => state.blog);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle tags input (comma-separated)
  const handleTagChange = (e) => {
    setFormData({
      ...formData,
      tags: e.target.value.split(",").map((tag) => tag.trim()),
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await createBlog(formData);
      if (response.success) {
        setMessage("Blog Created Successfully!");
        setFormData({
          title: "",
          body: "",
          status: "active",
          tags: [],
        });
        dispatch(setBlog([...blog, response.blog]));
        navigate(`/blog/${response.blog._id}`);
      } else {
        setMessage(
          response.message || "Failed to create blog. Please try again."
        );
      }
    } catch (error) {
      setMessage("Failed to create blog. Please try again.");
      console.error("Create Blog Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
      <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">
        Create a New Blog Post
      </h2>
      {message && (
        <div
          className={`text-center p-2 mb-4 ${
            message.includes("Success") ? "text-green-600" : "text-red-600"
          }`}
        >
          {message}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block font-medium text-gray-800 dark:text-gray-300">
            Title
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-lg focus:ring focus:ring-blue-300 dark:bg-gray-700 dark:text-white dark:border-gray-600"
          />
        </div>

        {/* Content */}
        <div>
          <label className="block font-medium text-gray-800 dark:text-gray-300">
            Content
          </label>
          <textarea
            name="body"
            value={formData.body}
            onChange={handleChange}
            rows="6"
            required
            className="w-full p-2 border rounded-lg focus:ring focus:ring-blue-300 dark:bg-gray-700 dark:text-white dark:border-gray-600"
          ></textarea>
        </div>

        {/* Status */}
        <div>
          <label className="block font-medium text-gray-800 dark:text-gray-300">
            Status
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {/* Tags */}
        <div>
          <label className="block font-medium text-gray-800 dark:text-gray-300">
            Tags (comma separated)
          </label>
          <input
            type="text"
            name="tags"
            value={formData.tags.join(", ")}
            onChange={handleTagChange}
            className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition dark:bg-blue-500 dark:hover:bg-blue-400"
        >
          {loading ? "Creating..." : "Create Blog"}
        </button>
      </form>
    </div>
  );
}

export default PostBlog;
