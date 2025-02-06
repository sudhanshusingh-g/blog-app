import { useNavigate } from "react-router-dom";

interface BlogCardProps {
  blog: {
    _id: string;
    title: string;
    body: string;
  };
  onDelete: () => void;
}

function BlogCard({ blog, onDelete }: BlogCardProps) {
  const navigate = useNavigate();

  return (
    <div className="p-4 rounded shadow flex flex-col gap-2 border">
      <h2 className="text-lg font-medium">{blog.title}</h2>
      <p className="text-sm text-gray-500">
        {blog.body.length > 100 ? blog.body.slice(0, 100) + "..." : blog.body}
      </p>
      <div>
        <button
          className="py-1 px-4 rounded bg-blue-500 text-white cursor-pointer hover:bg-blue-600 transition-all"
          onClick={() => navigate(`/edit-blog/${blog._id}`)}
        >
          Edit
        </button>
        <button
          className="text-rose-500 ml-2 cursor-pointer hover:underline py-1 px-4 rounded"
          onClick={onDelete}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default BlogCard;
