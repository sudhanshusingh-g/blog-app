import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

const Redirect = () => {
    const { token } = useAuth();

  return token ? <Navigate to="/" /> : <Outlet />;
};

export default Redirect;
