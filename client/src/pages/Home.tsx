import { useEffect, useState } from "react";
import BlogList from "../components/BlogList";
import { apiCall } from "../api/api";

interface Blog {
  _id: string;
  title: string;
  body: string;
}

function Home() {
  const [blogList, setBlogList] = useState<Blog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  


  async function getAllBlogs() {
    try {
      setLoading(true);
      const response = await apiCall<Blog[]>({
        method: "GET",
        url: "blogs",
      });

      setBlogList(response);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getAllBlogs();
  }, []);
  return (
    <div className="h-full mt-2 ">
      {loading ? (
        <p className="h-full flex items-center justify-center">loading....</p>
      ) : blogList.length > 0 ? (
        <BlogList blogList={blogList} />
      ) : (
        <p>No blogs available.</p>
      )}
    </div>
  );
}

export default Home;
