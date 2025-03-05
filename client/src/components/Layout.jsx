import { useContext } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import ThemeContext from "../context/ThemeContext";
import { BsMoonStars } from "react-icons/bs";
import { FiSun } from "react-icons/fi";
import { useSelector } from "react-redux";

const Layout = ({children}) => {
    const navigate=useNavigate();
    const {theme,toggleTheme}=useContext(ThemeContext);
    const {user}=useSelector((state)=>state.user);
  return (
    <>
      {/* Navbar */}
      <nav className=" py-4 border-b-[1px] dark:border-b-[1px] flex justify-between items-center">
        <button onClick={() => toggleTheme()} className="cursor-pointer">
          {theme === "dark" ? (
            <BsMoonStars size={24} />
          ) : (
            <FiSun size={24} color="orange" />
          )}
        </button>
        {!user ? (
          <button
            className="text-white bg-blue-600 px-4 py-2 rounded-md cursor-pointer hover:bg-blue-700 "
            onClick={() => navigate("/login")}
          >
            Login/Signup
          </button>
         ) : ( 
           <ul className="flex space-x-4 items-center">
            <li>
              <Link to={"/"} className="hover:underline text-md font-semibold">
                Home
              </Link>
            </li>
            <li>
              <Link
                to={"/create"}
                className="hover:bg-blue-700 text-md font-semibold bg-blue-600 text-white px-4 py-2 rounded-full cursor-pointer"
              >
                Post Blog
              </Link>
            </li>
            <li>
              <Link to={"/about"}>
                <img
                  src={user.image}
                  alt={user.name}
                  className="rounded-full w-8 h-8  hover:border-[2px] border-blue-400"
                />
              </Link>
            </li>
          </ul> 
         )} 
      </nav>

      {/* Main Content */}
      <section className="flex-1">
        {children}
      </section>
    </>
  );
};

export default Layout;
