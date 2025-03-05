import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { fetchBlogs } from "../api/blog";
import { setBlog } from "../redux/slices/blogSlice";
import { useAuth } from "../context/AuthProvider";

const Home = () => {
  const dispatch = useDispatch();
  const { blog } = useSelector((state) => state.blog);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const allBlogs = async () => {
    try {
      setLoading(true);
      const response = await fetchBlogs();
      dispatch(setBlog(response.blogs));
    } catch (error) {
      console.error("Error fetching blogs:", error);
      setError("Blog fetching failed.Try again");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!blog || blog.length === 0) {
      allBlogs();
    }
  }, [blog]);

  return (
    <>
      <h1 className="text-3xl font-bold text-center text-black dark:text-white my-4">
        Explore Blogs
      </h1>
      {error && (
        <p className="text-center text-red-500 text-lg font-semibold my-4">
          {error}
        </p>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-56 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"
            />
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {blog.map((b) => (
            <motion.div
              key={b._id}
              whileHover={{ scale: 1.02 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-all"
            >
              <div className="p-4">
                <h2 className="text-lg font-semibold text-black dark:text-white">
                  {b.title}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
                  {b.body.slice(0, 500)}
                </p>
                <button
                  className="mt-4 text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                  onClick={() => navigate(`/blog/${b._id}`)}
                >
                  Read More →
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </>
  );
};

export default Home;
