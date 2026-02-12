import axios from "axios";
import { useEffect } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch , useSelector} from "react-redux";
import { addToRequest } from "../redux/requestSlice";
import RequestCard from "./RequestCard";
const Request = ({request})=>{

    const dispatch = useDispatch();
    const requests = useSelector(store=>store.request.request)
    console.log("requestst ; " , requests)
 
    const getAllRequest = async()=>{
        try{
 
             const response = await axios.get(BASE_URL+"/api/v1/view/user/requests/recieved",{withCredentials:true});
             dispatch(addToRequest(response.data.connectionRequests))

        }catch(err){
            console.log(err);
        }
    }
     
    useEffect(()=>{
       getAllRequest();
    },[])
    return (
        <div className="flex flex-col items-start py-10">
            {
               requests.length < 1 ? <h1 className="text-center w-full font-semibold">No request</h1>  : requests.map((item)=>{
                    return <RequestCard key={item?.fromUserId?._id} item={item}/>
                })
            }
        </div>
    )
}

export default Request;