import axios from "axios";
import { Heart, User } from "lucide-react";
import { useEffect, useState } from "react";
import { FaHeart } from "react-icons/fa";
import { useParams } from "react-router-dom";

interface Blog {
  title: string;
  author: string;
  body: string;
  date: Date;
  meta: {
    favs: number;
  };
}

function Blog() {
  const { id } = useParams<{ id: string }>();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  async function getSingleBlog() {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        import.meta.env.VITE_BACKEND_URL + `api/blog/${id}`
      );
      const data = response.data;
      data.date = new Date(data.date);
      setBlog(data);
    } catch (err) {
      setError("Error fetching blog. Please try again later.");
      console.error("Error fetching blog:", err);
    } finally {
      setLoading(false);
    }
  }

  const increaseLikes = async () => {
    if (!blog) return;
    try {
      const updatedFavs = blog.meta.favs + 1;
      await axios.put(import.meta.env.VITE_BACKEND_URL + `api/blog/${id}`, {
        favs: updatedFavs,
      });
      setBlog({ ...blog, meta: { ...blog.meta, favs: updatedFavs } });
    } catch (err) {
      console.error("Error increasing likes:", err);
    }
  };

  useEffect(() => {
    if (id) getSingleBlog();
  }, [id]);

  return (
    <div className="mt-4 p-4 max-w-3xl mx-auto">
      {loading && <p className="text-center text-gray-500">Loading...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}
      {blog && (
        <>
          <div className="border-b-[1px] border-dashed pb-4">
            <h1 className="text-3xl font-bold mb-2">{blog.title}</h1>
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <User size={14} />
              <span>@{blog.author}</span>
              <span>|</span>
              <span>{blog.date.toLocaleDateString()}</span>
            </div>
          </div>
          <div className="my-4">
            <p className="text-md text-justify leading-relaxed">{blog.body}</p>
          </div>
          <div className="flex items-center justify-between mt-4">
            <span className="flex items-center text-gray-500 gap-1">
              {
                blog.meta.favs >0 ? (<>
              <FaHeart size={16} /> {blog.meta.favs} Favorites

                </>):(<>
              <Heart size={16} /> {blog.meta.favs} Favorites

                  </>)
              }
            </span>
            <button
              onClick={increaseLikes}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Like
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Blog;
