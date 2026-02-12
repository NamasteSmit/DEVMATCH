import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { removeFromRequest } from "../redux/requestSlice";

const RequestCard = ({item}) => {
    console.log("item",item)
    const dispatch = useDispatch();

    const handleAcceptUser = async()=>{
        const response = await axios.post(`${BASE_URL}/api/v1/request/review/accepted/${item._id}`,{},{withCredentials:true});
        console.log('response --=>>' , response);    
        dispatch(removeFromRequest(item.fromUserId._id));    
    }

    const handleRejectUser = async()=>{
        const response = await axios.post(BASE_URL+"/api/v1/request/review/rejected/"+item._id,{},{withCredentials:true});
        console.log(response);
        dispatch(removeFromRequest(item.fromUserId._id));   
    }

  return (
    <div className="bg-white border-2 shadow-md rounded-lg flex items-center justify-between p-4 mb-4 w-full max-w-2xl mx-auto">
      <div className="flex items-center gap-4">
        <img 
          src={item?.fromUserId?.photoUrl}
          alt={``}
          className="w-16 h-16 rounded-full object-cover shadow-sm"
        />
        <div>
          <h2 className="text-lg font-semibold">{item?.fromUserId?.firstname} {item.fromUserId?.lastname}</h2>
          <p className="text-sm text-gray-600 max-w-96">{item.fromUserId?.about}</p>
        </div>
      </div> 
      <div className="flex gap-2">
        <button
        onClick={handleAcceptUser}
          className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 transition"
        >
          Accept
        </button>
        <button
        onClick={handleRejectUser}
          className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition"
        >
          Reject
        </button>
      </div>
    </div>
  );
};

export default RequestCard;
