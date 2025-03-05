import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { addComment, getBlog, deleteBlog, toggleLike } from "../api/blog";
import { useDispatch, useSelector } from "react-redux";
import { BsHeartFill } from "react-icons/bs";
import { CiHeart } from "react-icons/ci";
import { IoChatbubblesOutline, IoSend } from "react-icons/io5";
import DeleteDialog from "../components/DeleteDialog";

function SingleBlog() {
  const [loading, setLoading] = useState(true);
  const [commentContent, setCommentContent] = useState("");
  const { id } = useParams();
  const dispatch = useDispatch();
  const [activeBlog,setActiveBlog]=useState({});
  const { user } = useSelector((state) => state.user);
  const { blog } = useSelector((state) => state.blog);
  const navigate = useNavigate();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isCommentsVisible, setIsCommentsVisible] = useState(false);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    getCurrentBlog();
  }, [id]);

  const getCurrentBlog = async () => {
    setLoading(true);
    try {
      const response = await getBlog(id); 
      setActiveBlog(response.blog.blog || {});
    } catch (error) {
      console.error("Error fetching blog:", error);
      setActiveBlog(null); 
    } finally {
      setLoading(false);
    }
  };

const handleLike = async () => {
  if (!user) {
    alert("Please login to like this blog.");
    return;
  }

  try {
    const response = await toggleLike(id);

    if (response && response.likedBy !== undefined) {
      setActiveBlog((prevBlog) => ({
        ...prevBlog,
        reactions: response.reactions,
        likedBy: [...response.likedBy], 
      }));
    } else {
      console.error("Failed to like/unlike blog:", response.message);
    }
  } catch (error) {
    console.error("Error liking/unliking blog:", error);
  }
};




  const postComment = async () => {
    if (!user) {
      alert("Please login to comment.");
      return;
    }

    if (!commentContent.trim()) return;

    try {
      const response = await addComment(id, commentContent);
      if (!response.error) {
        setCommentContent("");
        getCurrentBlog();
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
        navigate("/");
      } else {
        console.error("Failed to delete:", response.message);
      }
    } catch (error) {
      console.error("Error deleting blog:", error);
    }
  };
const hasUserLiked = activeBlog?.likedBy?.includes(user?._id);



  return (
    <section className="h-full">
      {loading ? (
        <div className="text-center py-10 text-lg font-semibold">
          Loading...
        </div>
      ) : activeBlog && Object.keys(activeBlog).length>0 ? (
        <>
          {/* Edit & Delete Buttons (Only for Blog Author) */}
          {user?.email === activeBlog?.author?.email && (
            <div className="flex items-center justify-end space-x-4 my-4">
              <button
                className="bg-blue-600 text-white rounded px-4 py-2 cursor-pointer hover:bg-blue-700"
                onClick={() => navigate(`/edit/${activeBlog._id}`)}
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

          {/* Blog Title */}
          <h1 className="text-4xl font-bold my-4">{activeBlog?.title}</h1>

          {/* Author Info */}
          <div className="flex items-center my-2 space-x-3 text-gray-400">
            <img
              src={activeBlog?.author?.image}
              alt={activeBlog?.author?.name}
              className="w-7 h-7 rounded-full"
            />
            <div>
              <span className="font-semibold text-sm">
                {activeBlog?.author?.name }
              </span>

              <span className="text-xs ml-2">
                {new Date(activeBlog?.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Blog Content */}
          <div className="mt-6 text-lg leading-relaxed my-2 min-h-1/3">
            {activeBlog?.body}
          </div>

          {/* Tags */}
          {activeBlog?.tags?.length > 0 && (
            <div className="my-4 flex flex-wrap gap-2">
              {activeBlog.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-gray-500 text-white text-xs px-1 w-fit py-1 rounded"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <hr className="my-4" />

          {/* Like & Comment Section */}
          <div className="flex justify-between items-center my-4">
            <div className="flex items-center space-x-2">
              <span className="cursor-pointer" onClick={handleLike}>
                {hasUserLiked ? (
                  <BsHeartFill className="text-red-500" size={24} />
                ) : (
                  <CiHeart className="text-gray-500" size={32} />
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
              {activeBlog?.reactions || 0} likes • {activeBlog?.comments?.length || 0} comments
            </p>
          </div>

          {/* Comments Section */}
          {/* Comments Section */}
          {isCommentsVisible && (
            <div className="mt-4">
              {activeBlog?.comments?.map((comment) => (
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

              {/* Add Comment Section */}
              {user ? (
                <div className="flex items-center space-x-4 p-4 border-t mt-4">
                  <img
                    src={user.image || "https://placehold.co/50"}
                    alt={user.name || "User"}
                    className="rounded-full h-9 w-9"
                  />
                  <input
                    type="text"
                    placeholder="Add comment"
                    className="border rounded indent-1 p-2 flex-grow"
                    onChange={(e) => setCommentContent(e.target.value)}
                    value={commentContent}
                  />
                  <button
                    className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700"
                    onClick={postComment}
                  >
                    <IoSend size={24} />
                  </button>
                </div>
              ) : (
                <p className="text-center text-red-500 mt-2">
                  Please login to comment.
                </p>
              )}
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
