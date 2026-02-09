import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch , useSelector } from "react-redux";
import { addUser } from "../redux/userSlice";

const Body = ()=>{
    const dispatch = useDispatch();
    const request = useSelector(store=>store.request.request);


    const user = useSelector(store => store.user.user);
    const getLoggedInUser = async()=>{
        try{
           const response = await axios.get(`${BASE_URL}/api/v1/profile/view`,{withCredentials:true})

           dispatch(addUser(response.data.user))

        }catch(err){
            console.log(err);
        }

    }
    
    useEffect(()=>{
        if(!user)
        getLoggedInUser()
    },[])
     
    return(
        <div className="">
            <Navbar request={request}/>
            <Outlet/>
            <Footer/>
        </div>
    )
}

export default Body;