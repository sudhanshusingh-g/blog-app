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
      <nav className=" py-2 px-4  shadow-md  dark:border-b-[1px]">
        <div className="mx-auto flex justify-between items-center">
          <button onClick={() => toggleTheme()} className="cursor-pointer">
            {theme === "dark" ? <BsMoonStars size={24} /> : <FiSun size={24} color="orange"/>}
          </button>
          {!user ? (
            <button
              className=" text-blue-600 px-4 py-2 rounded-md cursor-pointer hover:bg-blue-600 light:hover:text-white hover:dark:bg-gray-900 border"
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
      <main className="flex-1 flex">{children}</main>
    </div>
  );
};

export default Layout;
