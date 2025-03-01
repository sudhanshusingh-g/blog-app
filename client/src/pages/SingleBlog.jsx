import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { addComment, getBlog, deleteBlog, toggleLike } from "../api/blog";
import { setError } from "../redux/slices/blogSlice";
import { useDispatch, useSelector } from "react-redux";
import { BsHeartFill } from "react-icons/bs";
import { CiHeart } from "react-icons/ci";
import { IoChatbubblesOutline, IoSend } from "react-icons/io5";
import DeleteDialog from "../components/DeleteDialog";

function SingleBlog() {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(false);
  const [commentContent, setCommentContent] = useState("");
  const { id } = useParams();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isCommentsVisible, setIsCommentsVisible] = useState(false);


  useEffect(() => {
    getCurrentBlog();
  }, [id]);

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

  const handleLike = async () => {
    if (!user) {
      alert("Please login to like this blog.");
      return;
    }

    const response = await toggleLike(id);
    if (!response.error) {
      setBlog((prevBlog) => ({
        ...prevBlog,
        reactions: response.reactions,
        likedBy: response.likedBy, // Update liked users
      }));
    } else {
      console.error("Failed to like/unlike blog");
    }
  };

  const postComment = async () => {
    if (!user) {
      alert("Please login to comment.");
      return;
    }

    if (!commentContent.trim()) return; // Prevent empty comments

    try {
      const response = await addComment(id, commentContent);
      if (!response.error) {
        setCommentContent(""); // Clear input
        getCurrentBlog(); // Refresh comments
      } else {
        console.error(response.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteBlog = async () => {
    try {
      const response = await deleteBlog(id);
      if (!response.error) {
        navigate("/"); // Redirect after deletion
      } else {
        console.error("Failed to delete:", response.message);
      }
    } catch (error) {
      console.error("Error deleting blog:", error);
    }
  };

  const hasUserLiked = user && blog?.likedBy?.includes(user._id);

  return (
    <section className="w-full mx-auto px-6">
      {loading & user ? (
        <div className="text-center py-10 text-lg font-semibold">
          Loading...
        </div>
      ) : blog ? (
        <>
          {user?._id === blog?.author?._id && (
            <div className="flex items-center justify-end space-x-4">
              <button
                className="bg-blue-600 text-white rounded px-4 py-2 cursor-pointer hover:bg-blue-700"
                onClick={() => navigate(`/edit/${blog._id}`)}
              >
                Edit
              </button>
              <button
                className="bg-rose-600 text-white rounded px-4 py-2 cursor-pointer hover:bg-rose-700"
                onClick={() => setIsDeleteDialogOpen(true)}
              >
                Delete
              </button>
            </div>
          )}

          <div className="w-full h-60 rounded-lg overflow-hidden mb-4">
            <img
              src={blog?.image || "https://placehold.co/800x400"}
              alt={blog?.title || "Blog Image"}
              className="w-full h-full object-cover"
            />
          </div>

          <h1 className="text-4xl font-bold">{blog?.title}</h1>

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

          <div className="mt-6 text-lg leading-relaxed">{blog?.body}</div>

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

          <hr className="mt-4" />

          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <span className="cursor-pointer" onClick={handleLike}>
                {blog?.likedBy?.includes(user?._id) ? (
                  <BsHeartFill className="text-red-500" size={24} />
                ) : (
                  <CiHeart className="text-gray-500" size={24} />
                )}
              </span>

              <span
                className="cursor-pointer"
                onClick={() => setIsCommentsVisible(!isCommentsVisible)}
              >
                <IoChatbubblesOutline size={24} />
              </span>
            </div>
            <p>
              {blog.reactions} likes • {blog.comments.length} comments
            </p>
          </div>
          {isCommentsVisible &&
            blog.comments.map((comment) => (
              <div
                className="flex items-center space-x-4 p-4"
                key={comment._id}
              >
                <img
                  src={comment.user?.image || "https://placehold.co/50"}
                  alt={comment.user?.name || "User"}
                  className="rounded-full h-9 w-9"
                />
                <div>
                  <p className="font-semibold text-sm">
                    {comment.user?.name || "Anonymous"}
                  </p>
                  <p>{comment.content}</p>
                </div>
              </div>
            ))}

          {user ? (
            <div className="flex items-center space-x-4">
              <img
                src={user.image || "https://placehold.co/50"}
                alt={user.name || "User"}
                className="rounded-full h-9 w-9"
              />
              <input
                type="text"
                placeholder="Add comment"
                className="border rounded indent-1 p-4 w-[80%]"
                onChange={(e) => setCommentContent(e.target.value)}
                value={commentContent}
              />
              <div
                className="bg-blue-600 cursor-pointer hover:bg-blue-700 p-4 rounded-full"
                onClick={postComment}
              >
                <IoSend size={24} color="white" />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center space-y-2">
              <p>Please login to comment</p>
              <button
                onClick={() => navigate("/login")}
                className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer rounded py-2 px-6"
              >
                Login
              </button>
            </div>
          )}

          <DeleteDialog
            isOpen={isDeleteDialogOpen}
            onClose={() => setIsDeleteDialogOpen(false)}
            onConfirm={handleDeleteBlog}
          />
        </>
      ) : (
        <p className="text-center text-red-500">Blog not found.</p>
      )}
    </section>
  );
}

export default SingleBlog;
