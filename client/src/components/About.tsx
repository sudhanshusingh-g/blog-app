// import { SiGmail, SiLinkedin, SiGithub } from "react-icons/si";
import BlogCard from "./BlogCard";
import { useEffect, useState } from "react";
import axios from "axios";
import DeleteModal from "./DeleteModal";

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

  async function getAllBlogs() {
    try {
      const response = await axios.get<Blog[]>(import.meta.env.VITE_BACKEND_URL);
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
        import.meta.env.VITE_BACKEND_URL + `api/blog/${blogId}`
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

  return (
    <div>
      <h3 className="text-2xl font-semibold mt-8">Recent Blogs</h3>

      {loading ? (
        <p>Loading blogs...</p>
      ) : blogList.length === 0 ? (
        <p>No blogs available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {blogList
          .filter((blog)=>!blog.hidden)
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
