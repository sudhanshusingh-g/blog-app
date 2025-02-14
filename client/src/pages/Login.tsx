import { useState, ChangeEvent, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

interface FormData {
  email: string;
  password: string;
}

function Login() {
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
      console.log(response.data);
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

  return (
    <div className="flex items-center justify-center h-full">
      <form className="border p-4 rounded" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            className="border-b-[2px] indent-1 outline-none focus:border-blue-800"
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            name="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            className="border-b-[2px] indent-1 outline-none focus:border-blue-800"
          />
        </div>
        <button
          type="submit"
          className="border p-2 cursor-pointer rounded disabled:bg-gray-300 disabled:opacity-50"
          disabled={!formData.email || !formData.password}
        >
          Login
        </button>
        <p>
          New user? <Link to="/register">Register yourself</Link>
        </p>
      </form>
      {error && <p className="text-red-700 text-sm">{error}</p>}
    </div>
  );
}

export default Login;
