import { createContext, useContext, useEffect, useState } from "react";
import Loading from "../components/Loading";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/slices/userSlice";
import { currentuser } from "../api/user";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const setAuthToken = (newToken) => {
    setToken(newToken);
    localStorage.setItem("token", newToken);
  };

  useEffect(() => {
    const restoreSession = async () => {
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        setToken(storedToken);
        try {
          const user = await currentuser();
          if (user) {
            dispatch(setUser(user));
          }
        } catch (error) {
          console.error("Failed to restore user session", error);
          setAuthToken(null);
        }
      }
      setLoading(false);
    };

    restoreSession();
  }, [dispatch]);

  return (
    <AuthContext.Provider value={{ token, setAuthToken, setLoading, loading }}>
      {loading ? <Loading /> : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
