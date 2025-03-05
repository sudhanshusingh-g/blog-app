import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../api/user";
import { useNavigate } from "react-router-dom";
import { setUser } from "../redux/slices/userSlice";
import { useAuth } from "../context/AuthProvider";

const About = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const {setAuthToken}=useAuth();
  const handleLogout=async ()=>{
    try {
      const response=await logout();
      console.log(response);
      if(response.success){
        dispatch(setUser(null));
        setAuthToken(null);
        localStorage.removeItem("token");
      }
    } catch (error) {
      console.error("Error response: ",error);
    }
  }
 

  


  return (
    <div className="p-6 flex flex-col space-y-8">
      <div className="flex items-center w-full justify-between">
        <div>
          <img src={user.image} alt={user.name}
          className="w-24 h-24 rounded-full"
          />
          <p className="text-lg font-medium">Welcome, {user.name}!</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {user.email}
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
        {user.blogs.map((b) => (
          <div key={b._id} className="mt-4 shadow-md p-4 dark:shadow-blue-200/40 rounded cursor-pointer"
          onClick={()=>navigate(`/blog/${b._id}`)}
          >
            <h1>{b.title}</h1>
          </div>
        ))}
      </div>
    </div>
  );
};

export default About;
