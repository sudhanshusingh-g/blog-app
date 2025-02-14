import { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

interface FormData {
  name: string;
  email: string;
  password: string;
}

function Register() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

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
        `${import.meta.env.VITE_BACKEND_URL}users/register`,
        formData
      );
      console.log(response.data);
      setFormData({
        name: "",
        email: "",
        password: "",
      });
      navigate("/login");
    } catch (error: any) {
      if (error.response?.data?.error) {
        setError(error.response.data.error);
      } else {
        setError("Registration failed. Try again.");
      }
    }
  };

  return (
    <div className="flex flex-col gap-4 items-center justify-center h-full">
      <form className="border p-4 rounded" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            name="name"
            id="name"
            autoComplete="on"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your name"
            className="border-b-[2px] indent-1 outline-none focus:border-blue-800"
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            name="email"
            autoComplete="on"
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
        <button type="submit" className="px-2 py-1 cursor-pointer rounded disabled:opacity-50 bg-blue-700 text-white"
        disabled={!formData.name || !formData.email || !formData.password}
        >
          Signup
        </button>
        <p>
          Already user? <Link to="/login">Login here</Link>
        </p>
      </form>
      {error && <p className="text-red-700 text-sm">{error}</p>}
    </div>
  );
}

export default Register;
