import {useSelector} from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'

function Protected() {
    const {user}=useSelector((state)=> state.user);
    
  return (
    user ?<Outlet/>:<Navigate to={"/login"}/>
  )
}

export default Protected