import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const Redirect = () => {
  const { user } = useSelector((state) => state.user);

  return user ? <Navigate to="/" /> : <Outlet />;
};

export default Redirect;
