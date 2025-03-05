import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { currentuser, login } from "../api/user";
import { setUser, } from "../redux/slices/userSlice";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useAuth } from "../context/AuthProvider";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const navigate=useNavigate();
  const dispatch=useDispatch();
  const [error, setError] = useState("");
  const[loading,setLoading]=useState(false);
  const { setAuthToken } = useAuth();

  

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError("");

  const response = await login(formData); 

  if (response.success) {
    setAuthToken(response.token); 

    const user = await currentuser(); 
    if (user) {
      dispatch(setUser(user));
      navigate("/");
    }
  } else {
    setError(response.message || "Something went wrong. Please try again.");
  }

  setLoading(false);
};

  return (
    <div className="w-full flex justify-center items-center min-h-screen transition-all">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md w-96 transition-all">
        <h2 className="text-2xl font-bold mb-4 text-center text-black dark:text-white">
          Login
        </h2>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium text-black dark:text-white">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-black dark:text-white focus:ring-blue-500 dark:focus:ring-blue-400"
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <label className="block text-sm font-medium text-black dark:text-white">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full border rounded-lg p-2 pr-10 focus:outline-none focus:ring-2 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-black dark:text-white focus:ring-blue-500 dark:focus:ring-blue-400"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-9 transform -translate-y-1/2 text-gray-500 dark:text-gray-300"
            >
              {showPassword ? (
                <AiOutlineEyeInvisible size={20} />
              ) : (
                <AiOutlineEye size={20} />
              )}
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full p-2 rounded-lg transition duration-300 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Signup Link */}
        <p className="text-sm text-center mt-4 text-black dark:text-white">
          Don't have an account?{" "}
          <span
            className="text-blue-600 dark:text-blue-400 cursor-pointer hover:underline"
            onClick={() => navigate("/signup")}
          >
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
