import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signup } from "../api/user";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const Signup = () => {
  const [values, setValues] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!values.name || !values.email || !values.password) {
      setError("All fields are required!");
      return;
    }

    if (values.password.length < 6) {
      setError("Password must be at least 6 characters long!");
      return;
    }

    try {
      setLoading(true);
      const response = await signup(values);
      if (response.success) {
        navigate("/login");
      } else {
        setError(response.message || "Signup failed. Please try again.");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex justify-center items-center transition-all min-h-screen">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md w-96 transition-all">
        <h2 className="text-2xl font-bold mb-4 text-center text-black dark:text-white">
          Sign Up
        </h2>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-black dark:text-white">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={values.name}
              onChange={handleChange}
              required
              className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-black dark:text-white focus:ring-blue-500 dark:focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black dark:text-white">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={values.email}
              onChange={handleChange}
              required
              className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-black dark:text-white focus:ring-blue-500 dark:focus:ring-blue-400"
            />
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-black dark:text-white">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={values.password}
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

          <button
            type="submit"
            className="w-full p-2 rounded-lg transition duration-300 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        <p className="text-sm text-center mt-4 text-black dark:text-white">
          Already have an account?{" "}
          <span
            className="text-blue-600 dark:text-blue-400 cursor-pointer hover:underline"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default Signup;
