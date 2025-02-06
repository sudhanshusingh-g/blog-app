import axios from "axios"
import { useEffect, useState } from "react";
import BlogList from "./BlogList";

interface Blog {
  _id: string;
  title: string;
  body: string;
}



function BlogHomepage() {
    const [blogList, setBlogList] = useState<Blog[]>([]);
    const [loading, setLoading] = useState<boolean>(true)
    async function getAllBlogs(){
        try {

            const response = await axios.get<Blog[]>(
              import.meta.env.BACKEND_URL
            );
            setBlogList(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching blogs:", error);
            setLoading(false);
        }
    }

    useEffect(() => {
      getAllBlogs()
    }, [])
    
  return (
    <div className="h-full mt-2 ">
        {
            loading ? (
                <p>loading....</p>
            ):(
                blogList.length>0?(<BlogList blogList={blogList}/>):(<p>No blogs available.</p>)

            )
        }
    </div>
  )
}

export default BlogHomepage;