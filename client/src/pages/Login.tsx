import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../redux/slices/authSlice";
import { RootState } from "../redux/store";

interface FormData {
  email: string;
  password: string;
}

function Login() {
  const dispatch = useDispatch();
  const {token} = useSelector((state: RootState) => state.auth);

  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    addFormData(formData);
  };

  const addFormData = async (formData: FormData) => {
    try {
      setError(null);
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}users/login`,
        formData
      );
      const {token,existingUser}=response.data;
      if (token) {
        dispatch(
          login({
            token,
            user: {
              name: existingUser.name,
              email: existingUser.email,
              image: existingUser.image || "",
            },
          })
        );
        localStorage.setItem("token", token);

      }
      setFormData({
        email: "",
        password: "",
      });
      navigate("/");
    } catch (error: any) {
      if (error.response?.data?.error) {
        setError(error.response.data.error);
      } else {
        setError("Login failed. Try again.");
      }
    }
  };

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="max-w-md w-full">
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-800 shadow-md rounded-lg px-8 pt-6 pb-8 mb-4 border border-gray-200 dark:border-gray-700"
        >
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-4">
              Welcome back
            </h2>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Email:
              </label>
              <input
                type="email"
                name="email"
                id="email"
                autoComplete="on"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400"
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Password:
              </label>
              <input
                type="password"
                name="password"
                id="password"
                autoComplete="on"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400"
              />
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <button
              type="submit"
              disabled={!formData.email || !formData.password}
              className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed"
            >
              Login
            </button>
            <p className="text-center text-sm text-gray-600 dark:text-gray-400">
              New user?{" "}
              <Link
                to="/register"
                className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
              >
                Register yourself
              </Link>
            </p>
          </div>
        </form>
        {error && (
          <div className="bg-red-50 dark:bg-red-900/50 border-l-4 border-red-400 dark:border-red-500 p-4 rounded">
            <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Login;
