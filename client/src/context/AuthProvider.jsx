import { createContext, useContext, useEffect, useState } from "react";
import { currentuser } from "../api/user";
import { useDispatch } from "react-redux";
import { setUser, setLoading, setError } from "../redux/slices/userSlice";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false); 

  useEffect(() => {
    const fetchUser = async () => {
      try {
        dispatch(setLoading());
        const user = await currentuser();
        if (user) {
          dispatch(setUser(user));
        } else {
          dispatch(setError());
        }
      } catch (error) {
        dispatch(setError());
      } finally {
        setIsLoaded(true); 
      }
    };

    fetchUser();
  }, [dispatch]);

  return (
    <AuthContext.Provider value={{ isLoaded }}>
      {isLoaded ? children : <div>Loading...</div>}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
