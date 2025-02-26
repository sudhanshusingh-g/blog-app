import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUser, setError, setLoading } from "../redux/slices/userSlice";
import { logout, currentuser } from "../api/user";
import { useNavigate } from "react-router-dom";

const About = () => {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.user);
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-800 text-black dark:text-white p-6">
      <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md w-96 text-center">
        <h2 className="text-2xl font-bold mb-4">About Page</h2>
        <p className="text-lg font-medium">Welcome, {user.name}!</p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Email: {user.email}
        </p>
        <button
          onClick={handleLogout}
          className="mt-4 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition duration-300"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default About;
