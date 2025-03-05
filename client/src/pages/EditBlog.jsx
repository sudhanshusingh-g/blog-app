import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { updateBlog } from "../api/blog";

function EditBlog() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { blog } = useSelector((state) => state.blog);
  const [loading, setLoading] = useState(false);
  const [error,setError]=useState("");


 

  const selectedBlog = blog.find((b) => b._id === id);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    image: null,
    status: "active",
    author: "",
    tags: [],
  });

  useEffect(() => {
    if (selectedBlog) {
      setFormData({
        title: selectedBlog.title || "",
        content: selectedBlog.body || "",
        image: selectedBlog.image || null,
        status: selectedBlog.status || "active",
        author: selectedBlog.author?.name || "",
        tags: selectedBlog.tags || [],
      });
    }
  }, [selectedBlog]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleTagChange = (e) => {
    setFormData({ ...formData, tags: e.target.value.split(",") });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedData = {
      title: formData.title,
      body: formData.content,
      tags: formData.tags,
      status: formData.status,
    };

    try {
      const response = await updateBlog(id, updatedData);

      if (response.error) {
        console.error("Failed to update blog:", response.message);
      } else {
        navigate(`/blog/${id}`);
      }
    } catch (error) {
      console.error("Error updating blog:", error.message);
    }
  };

  if (!selectedBlog) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500 text-xl">Blog not found.</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <div className="w-full max-w-2xl bg-white dark:bg-gray-800 p-6 shadow-md rounded-lg">
        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
          Edit Blog Post
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title (Editable) */}
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

          {/* Content (Editable) */}
          <div>
            <label className="block font-medium text-gray-800 dark:text-gray-300">
              Content
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows="6"
              required
              className="w-full p-2 border rounded-lg focus:ring focus:ring-blue-300 dark:bg-gray-700 dark:text-white dark:border-gray-600"
            ></textarea>
          </div>

          {/* Status (Editable) */}
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

          {/* Author Name (Disabled) */}
          <div>
            <label className="block font-medium text-gray-800 dark:text-gray-300">
              Author Name
            </label>
            <input
              type="text"
              name="author"
              value={formData.author}
              disabled
              className="w-full p-2 border rounded-lg bg-gray-300 dark:bg-gray-700 dark:text-white dark:border-gray-600 cursor-not-allowed"
            />
          </div>

          {/* Tags (Editable) */}
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
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition dark:bg-blue-500 dark:hover:bg-blue-400"
          >
            Update Blog
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditBlog;
