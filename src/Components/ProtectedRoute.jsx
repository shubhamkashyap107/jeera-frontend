import axios from "axios"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Navigate, Outlet, useNavigate } from "react-router-dom"
import { addUserData } from "../Utils/redux/userSlice"
import Loading from "./Loading"


const ProtectedRoutes = () => {

 

    const userData = useSelector(store => store.user)
    const dispatch = useDispatch()
    const nav = useNavigate()

    useEffect(() => {
        axios.get(import.meta.env.VITE_BACKEND_URL + "/api/auth/me", {withCredentials : true})
        .then((res) => {
            // console.log(res)
            dispatch(addUserData(res.data.data))
        })
        .catch(() => {
            nav("login")
        })
    }, [])


    if(!userData)
    {
        return <Loading />
    }
    

    return <Outlet />


  
    // return userData ? <Outlet /> : <Navigate to={'/login'} />

}

export default ProtectedRoutes