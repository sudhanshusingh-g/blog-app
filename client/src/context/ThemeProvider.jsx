import { useEffect, useState } from "react"
import ThemeContext from "./ThemeContext";

const ThemeProvider=({children})=>{
    const [theme, setTheme] = useState(
      localStorage.getItem("theme") ||
        (window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light")
    );
    const toggleTheme=()=>setTheme(theme === "dark" ? "light" : "dark");
    

    useEffect(()=>{
        document.documentElement.classList.toggle("dark", theme === "dark");
        localStorage.setItem("theme", theme);
    },[theme]);

    return (
        <ThemeContext.Provider value={{theme,toggleTheme}}>
            {children}
        </ThemeContext.Provider>
    )
}

export default ThemeProvider;