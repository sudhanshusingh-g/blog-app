import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUser, setError, setLoading } from "../redux/slices/userSlice";
import { logout, currentuser } from "../api/user";
import { useNavigate } from "react-router-dom";

const About = () => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      dispatch(setLoading()); // Set loading state
      try {
        const fetchedUser = await currentuser(); // Get user from backend
        if (fetchedUser) {
          dispatch(setUser(fetchedUser));
        } else {
          dispatch(setUser(null)); // Fix: Ensure state updates when user is not found
        }
      } catch (error) {
        dispatch(setError("Failed to fetch user."));
      }
    };

    fetchUser();
  }, [dispatch]);

  const handleLogout = async () => {
    try {
      const response = await logout();
      if (response.success) {
        dispatch(setUser(null));
        navigate("/login");
      }
    } catch (error) {
      dispatch(setError(error.message || "Logout failed"));
    }
  };

  if (loading)
    return <div className="text-center text-gray-500">Loading...</div>;
  if (!user)
    return (
      <div className="text-center text-gray-500">
        User not found. Please login.
      </div>
    );

  return (
    <div className="p-6 flex flex-col space-y-8">
      <div className="flex items-center w-full justify-between">
        <div>
          <img src={user.user.image} alt={user.user.name} 
          className="w-24 h-24 rounded-full"
          />
          <p className="text-lg font-medium">Welcome, {user.user.name}!</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {user.user.email}
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="mt-4 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg cursor-pointer transition duration-300"
        >
          Logout
        </button>
      </div>
      <div>
        <h1 className="text-xl font-semibold">Published Blogs</h1>
        {user.user.blogs.map((b) => (
          <div key={b._id} className="mt-4 shadow-md p-4 dark:shadow-blue-200/40 rounded cursor-pointer">
            <h1>{b.title}</h1>
          </div>
        ))}
      </div>
    </div>
  );
};

export default About;
