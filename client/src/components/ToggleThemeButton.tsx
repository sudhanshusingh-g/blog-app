import { MoonStar, Sun } from "lucide-react";
import { useTheme } from "../context/ThemeContext"

function ToggleThemeButton() {
    const {theme,toggleTheme}=useTheme();
  return (
    <button
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
      className="p-2 rounded transition-all duration-300 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 cursor-pointer"
    >
      {theme === "dark" ? <MoonStar /> : <Sun />}
    </button>
  );
}

export default ToggleThemeButton