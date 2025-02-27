import { useEffect } from "react";
import { allBlogs } from "../api/blog";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setBlog, setError } from "../redux/slices/blogSlice";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { blog, loading, error } = useSelector((state) => state.blog);
  const dispatch = useDispatch();

  const navigate=useNavigate();

  const fetchBlogs = async () => {
    try {
      dispatch(setLoading());
      const response = await allBlogs();
      if (response.error) {
        dispatch(setError());
      } else {
        dispatch(setBlog(response));
      }
    } catch (error) {
      dispatch(setError());
      console.error(error);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <div className=" w-full p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-black dark:text-white mb-6">
          Explore Blogs
        </h1>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="h-48 bg-gray-300 dark:bg-gray-700 rounded-lg animate-pulse"
              />
            ))}
          </div>
        ) : error ? (
          <p className="text-center text-red-500">
            Error loading blogs. Please try again.
          </p>
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
                <img
                  src={b.image || "https://placehold.co/400"}
                  alt={b.title}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4">
                  <h2 className="text-lg font-semibold text-black dark:text-white">
                    {b.title}
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
                    {b.body.slice(0, 100)}...
                  </p>
                  <button className="mt-4 text-blue-600 dark:text-blue-400 hover:underline"
                  onClick={()=>navigate(`/blog/${b._id}`)}
                  >
                    Read More →
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Home;
