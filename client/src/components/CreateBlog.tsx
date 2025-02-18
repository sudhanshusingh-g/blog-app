import { Link, useNavigate } from "react-router-dom";
import { FormEvent, useState } from "react";
import { apiCall } from "../api/api";

interface BlogFormData {
  title: string;
  body: string;
  author: string;
  visibility: "active" | "inactive";
  meta: {
    votes: number;
    favs: number;
  };
}


function CreateBlog() {

  const navigate=useNavigate();

  const [formData, setFormData] = useState<BlogFormData>({
    title: "",
    body: "",
    author: "",
    visibility: "active",
    meta: {
      votes: 0,
      favs: 0,
    },
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      visibility: e.target.value as "active" | "inactive",
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const payload = {
      title: formData.title,
      body: formData.body,
      author: formData.author,
      hidden: formData.visibility === "inactive",
      meta: {
        votes: formData.meta.votes,
        favs: formData.meta.favs,
      },
    };

    try {
      await apiCall<BlogFormData>({
        method:"POST",
        url:"blogs",
        data:payload
      });
      navigate("/");
      setFormData({
        title: "",
        body: "",
        author: "",
        visibility: "active",
        meta: {
          votes: 0,
          favs: 0,
        },
      });
    } catch (error) {
      console.error("Error submitting the blog:", error);
    }
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">Create a New Blog Post</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label htmlFor="blog_title" className="block mb-2 font-medium">
            Title
          </label>
          <input
            type="text"
            name="title"
            id="blog_title"
            placeholder="Title goes here"
            value={formData.title}
            onChange={handleInputChange}
            required
            className="border w-full rounded focus:outline-none indent-4 p-2 focus:border-blue-500"
          />
        </div>

        {/* Body */}
        <div>
          <label htmlFor="blog_body" className="block mb-2 font-medium">
            Body
          </label>
          <textarea
            name="body"
            id="blog_body"
            placeholder="Write your thoughts here..."
            rows={10}
            value={formData.body}
            onChange={handleInputChange}
            required
            className="border w-full rounded focus:outline-none indent-4 p-2 focus:border-blue-500"
          />
        </div>

        {/* Author */}
        <div>
          <label htmlFor="blog_author" className="block mb-2 font-medium">
            Author
          </label>
          <input
            type="text"
            name="author"
            id="blog_author"
            placeholder="Author's name"
            value={formData.author}
            onChange={handleInputChange}
            required
            className="border w-full rounded focus:outline-none indent-4 p-2"
          />
        </div>

        {/* Active / Inactive Blog */}
        <div className="flex gap-4 items-center">
          <span className="font-medium">Status:</span>
          <label htmlFor="active" className="flex items-center gap-1">
            <input
              type="radio"
              name="visibility"
              id="active"
              value="active"
              checked={formData.visibility === "active"}
              onChange={handleStatusChange}
            />
            Active
          </label>
          <label htmlFor="inactive" className="flex items-center gap-1">
            <input
              type="radio"
              name="visibility"
              id="inactive"
              value="inactive"
              checked={formData.visibility === "inactive"}
              onChange={handleStatusChange}
            />
            Inactive
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-black text-white py-2 px-8 rounded-md cursor-pointer hover:bg-gray-800 transition-all duration-200"
        >
          Post
        </button>
      </form>

      {/* Navigation Link */}
      <Link to={"/"} className="text-blue-500 hover:underline mt-6 block">
        &lt;&lt; Back to all blogs
      </Link>
    </div>
  );
}

export default CreateBlog;
