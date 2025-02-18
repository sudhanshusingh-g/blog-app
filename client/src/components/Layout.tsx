import { Feather } from "lucide-react";
import { Link, useNavigate, Outlet } from "react-router-dom";
import ToggleThemeButton from "./ToggleThemeButton";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

function Layout() {
  const token = useSelector((state: RootState) => state.auth.token);
  const navigate = useNavigate();

  return (
    <div className="max-w-3/4 mx-auto h-screen">
      {/* Navigation */}
      <nav className="flex items-center justify-between py-4 border-b-[1px] h-[8%]">
        <ToggleThemeButton />
        {token ? (
          <ul className="flex items-center gap-4 font-semibold">
            <li className="cursor-pointer relative after:absolute after:left-0 after:bottom-0 after:h-[2px] after:bg-black dark:after:bg-white after:w-0 after:transition-all hover:after:w-full">
              <Link to={"/"}>Blogs</Link>
            </li>
            <li className="cursor-pointer relative after:absolute after:left-0 after:bottom-0 after:h-[2px] after:bg-black dark:after:bg-white after:w-0 after:transition-all hover:after:w-full">
              <Link to={"/about"}>About</Link>
            </li>
            <li
              className="flex items-center gap-1 border rounded-full p-2 text-sm cursor-pointer
                hover:bg-black hover:text-white hover:scale-105 transition-all duration-300 ease-in-out 
                dark:hover:bg-white dark:hover:text-black"
              onClick={() => navigate("/create-blog")}
            >
              <Feather size={16} />
              <span>Post a blog</span>
            </li>
          </ul>
        ) : (
          <button
            className="flex items-center gap-1 shadow-md rounded p-2 text-sm cursor-pointer
              hover:bg-black hover:text-white hover:scale-105 transition-all duration-300 ease-in-out 
              dark:hover:bg-white dark:hover:text-black"
            onClick={() => navigate("/login")}
          >
            <span>Login</span>
          </button>
        )}
      </nav>

      {/* Content */}
      <section className="h-[92%] overflow-scroll no-scrollbar">
        <Outlet /> {/* This will render the nested route components */}
      </section>
    </div>
  );
}

export default Layout;
