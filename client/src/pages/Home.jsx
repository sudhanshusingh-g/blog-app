import { useEffect, useState } from "react"
import { allBlogs } from "../api/blog";
import { useDispatch, useSelector } from "react-redux";
import { setLoading,setBlog,setError } from "../redux/slices/blogSlice";
function Home() {
    const { blog, loading, error } = useSelector((state) => state.blog);
    const dispatch=useDispatch();


    const fetchBlogs=async ()=>{
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

    }

    useEffect(()=>{
        fetchBlogs();
    },[])

  return (
    <div>
      {loading ? (
        <p>Loading.....</p>
      ) : error ? (
        <p>Error loading blogs.</p>
      ) : (
        <ul className="p-4">
          {blog.map((b) => (
            <li key={b._id}>{b.title}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Home