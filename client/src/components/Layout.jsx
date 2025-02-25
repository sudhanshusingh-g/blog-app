import { useContext } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import ThemeContext from "../context/ThemeContext";
import { BsMoonStars } from "react-icons/bs";
import { FiSun } from "react-icons/fi";

const Layout = ({ children }) => {
    const { user } = useSelector((state) => state.user);
    const navigate=useNavigate();
    const {theme,toggleTheme}=useContext(ThemeContext);
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className=" p-4 shadow-md">
        <div className="mx-auto flex justify-between items-center">
          <button onClick={() => toggleTheme()}>
            {theme === "dark" ? <BsMoonStars /> : <FiSun />}
          </button>
          {!user ? (
            <button
              className=" text-blue-600 px-4 py-2 rounded-md cursor-pointer"
              onClick={() => navigate("/login")}
            >
              Login/Signup
            </button>
          ) : (
            <ul className="hidden md:flex space-x-4">
              <li>
                <Link to={"/"} className="hover:underline">
                  Home
                </Link>
              </li>
              <li>
                <Link to={"/about"} className="hover:underline">
                  About
                </Link>
              </li>
            </ul>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-4 shadow-md">{children}</main>
    </div>
  );
};

export default Layout;
