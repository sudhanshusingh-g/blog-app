// import { SiGmail, SiLinkedin, SiGithub } from "react-icons/si";
import BlogCard from "./BlogCard";
import { useEffect, useState } from "react";
import axios from "axios";
import DeleteModal from "./DeleteModal";
import { useDispatch } from "react-redux";
import { logout } from "../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";

interface Blog {
  _id: string;
  title: string;
  body: string;
  hidden:boolean;
}

function About() {
  const [blogList, setBlogList] = useState<Blog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [deleteBlogId, setDeleteBlogId] = useState<string | null>(null);
  const dispatch=useDispatch();
  const navigate=useNavigate();

  async function getAllBlogs() {
    try {
      const response = await axios.get<Blog[]>(import.meta.env.VITE_BACKEND_URL+"blogs");
      setBlogList(response.data);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteBlog(blogId: string) {
    try {
      await axios.delete(
        import.meta.env.VITE_BACKEND_URL + `blogs/${blogId}`
      );
      setBlogList(blogList.filter((blog) => blog._id !== blogId));
      setDeleteBlogId(null);
    } catch (error) {
      console.error("Error deleting blog:", error);
    }
  }

  useEffect(() => {
    getAllBlogs();
  }, []);

  const handleLogOut=()=>{
    dispatch(logout());
    localStorage.removeItem("token");
    navigate("/");
  }

  return (
    <div>
      <h3 className="text-2xl font-semibold mt-8">Recent Blogs</h3>
      <button
        className="flex items-center gap-1 shadow-md rounded px-2 py-1 text-sm cursor-pointer
  hover:bg-black hover:text-white hover:scale-105 transition-all duration-300 ease-in-out dark:hover:bg-white dark:hover:text-black"
      onClick={handleLogOut}
      >
        Logout
      </button>
      {loading ? (
        <p>Loading blogs...</p>
      ) : blogList.length === 0 ? (
        <p>No blogs available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {blogList
            .filter((blog) => !blog.hidden)
            .map((blog) => (
              <BlogCard
                key={blog._id}
                blog={blog}
                onDelete={() => setDeleteBlogId(blog._id)}
              />
            ))}
        </div>
      )}

      {deleteBlogId && (
        <DeleteModal
          onConfirm={() => handleDeleteBlog(deleteBlogId)}
          onCancel={() => setDeleteBlogId(null)}
        />
      )}
    </div>
  );
}

export default About;
