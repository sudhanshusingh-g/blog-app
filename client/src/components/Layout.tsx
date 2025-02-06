import { ReactNode } from "react"
import { Feather, MoonStar } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

interface LayoutProps{
    children:ReactNode;
}

function Layout({children}:LayoutProps) {
    const navigate=useNavigate();
  return (
    <div className="max-w-3/4 mx-auto h-screen">
      {/* Navigation */}
      <nav className="flex items-center justify-between py-4 border-b-[1px] h-[8%]">
        <div className="border rounded p-1 cursor-pointer shadow-lg">
          <MoonStar />
        </div>
        <ul className="flex items-center gap-4 font-semibold">
          <li className="cursor-pointer relative after:absolute after:left-0 after:bottom-0 after:h-[2px] after:bg-black after:w-0 after:transition-all hover:after:w-full">
            <Link to={"/"}>Blogs</Link>
          </li>

          <li className="cursor-pointer relative after:absolute after:left-0 after:bottom-0 after:h-[2px] after:bg-black after:w-0 after:transition-all hover:after:w-full">
            <Link to={"/about"}>About</Link>
          </li>
          <li
            className="flex items-center gap-1 border rounded-full p-2 text-sm cursor-pointer
  hover:bg-black hover:text-white hover:scale-105 transition-all duration-300 ease-in-out"
            onClick={() => navigate("/create-blog")}
          >
            <Feather size={16} />
            <span>Post a blog</span>
          </li>
        </ul>
      </nav>
      {/* Content */}
      <section className="h-[92%] overflow-scroll no-scrollbar">{children}</section>
    </div>
  );
}

export default Layout