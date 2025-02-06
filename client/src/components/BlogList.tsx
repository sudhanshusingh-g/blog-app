import { FC } from "react";
import { Link } from "react-router-dom";

interface Blog {
  _id: string;
  title: string;
  body: string;
}

interface BlogListProps {
  blogList: Blog[];
}

const BlogList: FC<BlogListProps> = ({ blogList }) => {
  return (
    <div className=" flex flex-col gap-4">
      {blogList.map((blog) => (
        <div key={blog._id} className="shadow-md border p-2 rounded">
          <Link to={`/blog/${blog._id}`}>
            <h3 className="font-semibold underline text-lg">{blog.title}</h3>
          </Link>
          <p className="mt-1">
            {blog.body.split("\n")[0].slice(0, 16)}
            {blog.body.length > 100 ? "..." : ""}
          </p>
        </div>
      ))}
    </div>
  );
};

export default BlogList;
