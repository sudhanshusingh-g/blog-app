import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getBlog } from "../api/blog";
import { setError } from "../redux/slices/blogSlice";
import { useDispatch } from "react-redux";

function SingleBlog() {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(false);
  const [comment, setComment] = useState("");
  const { id } = useParams();
  const dispatch = useDispatch();

  const getCurrentBlog = async () => {
    try {
      setLoading(true);
      const response = await getBlog(id);
      if (response) {
        setBlog(response);
      } else {
        dispatch(setError("Blog not found"));
      }
    } catch (error) {
      dispatch(setError(error.message || "An error occurred"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCurrentBlog();
  }, [id]);

  // Handle new comment submission
  const handleAddComment = () => {
    if (comment.trim() === "") return;

    const newComment = {
      text: comment,
      id: new Date().getTime(), // Temporary ID
    };

    setBlog((prevBlog) => ({
      ...prevBlog,
      comments: [...(prevBlog?.comments || []), newComment.text], // Append new comment
    }));

    setComment(""); // Clear input field
  };

  return (
    <section className="w-full  mx-auto p-6">
      {loading ? (
        <div className="text-center py-10 text-lg font-semibold">
          Loading...
        </div>
      ) : blog ? (
        <>
          {/* Blog Image */}
          <div className="w-full h-60 rounded-lg overflow-hidden mb-4">
            <img
              src={blog?.image || "https://placehold.co/800x400"}
              alt={blog?.title || "Blog Image"}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Blog Title */}
          <h1 className="text-4xl font-bold ">{blog?.title}</h1>

          {/* Author & Metadata */}
          <div className="flex items-center mt-3 space-x-3 text-gray-400">
            <img
              src={blog?.author?.image || "https://placehold.co/50"}
              alt={blog?.author?.name || "Author"}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <span className="font-semibold">
                {blog?.author?.name || "Unknown Author"}
              </span>
              <p className="text-sm">
                {new Date(blog?.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Blog Content */}
          <div className="mt-6 text-lg leading-relaxed ">
            {blog?.body}
          </div>

          {/* Tags */}
          {blog?.tags?.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {blog.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-blue-500 text-white text-sm px-3 py-1 rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Comments Section */}
          <div className="mt-8">
            <h2 className="text-2xl font-semibold">
              Comments ({blog?.comments?.length})
            </h2>
            <div className="mt-4 bg-gray-100 p-4 rounded-lg">
              {blog?.comments?.length > 0 ? (
                blog.comments.map((comment, i) => (
                  <div key={i} className="border-b py-2">
                    <p className="text-gray-800">{comment}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No comments yet.</p>
              )}
            </div>

            {/* Add Comment Section */}
            <div className="mt-6">
              <textarea
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                placeholder="Write a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              ></textarea>
              <button
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                onClick={handleAddComment}
              >
                Add Comment
              </button>
            </div>
          </div>
        </>
      ) : (
        <p className="text-center text-red-500">Blog not found.</p>
      )}
    </section>
  );
}

export default SingleBlog;
