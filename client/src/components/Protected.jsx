import {useSelector} from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthProvider';

function Protected() {
    const {token}=useAuth();

    
  return (
    token ?<Outlet/>:<Navigate to={"/login"}/>
  )
}

export default Protected