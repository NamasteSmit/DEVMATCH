import { useSelector , useDispatch } from "react-redux";
import { removeUser } from "../redux/userSlice";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
const Navbar = ({request}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(store=>store.user.user);
  console.log("user in header ",user)

  const handleLogout = async()=>{
    const response = await axios.post(`${BASE_URL}/api/v1/user/logout`,
      {},
      {withCredentials:true}
    )
    console.log('logout..',response);
    dispatch(removeUser());
    console.log("removed user")
    return navigate('/login',{replace : true})
  }

  return (
    <div className="navbar bg-base-100 shadow-sm border px-8">
      <div className="flex-1">
        <Link to={'/'} className="btn btn-ghost text-3xl bg-gradient-to-r from-blue-800 via-blue-700 to to-blue-400 bg-clip-text text-transparent">Hello Q</Link>
      </div>
      <div className="flex gap-2 items-center">
        <div>
          <p className="font-medium">Welcome , {user && user?.firstname}</p>
        </div>
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar"
          >
            <div className="w-8 h-8 rounded-full">
              <img src={ user.photoUrl || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQaug-g5Z04tokddmyT_jagpcVo0IwR_EVMMcNuxo4GmHfpri1ZiqFuLxoS5vGNRXYx6m-qBcN3VnfySKzFgZSAOR27NNcsIgzjy9CjCl_b3w&s=10"}  />
            </div>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
          >
            <li>
              <Link to={'/profile'} className="justify-between">
                Profile
                <span className="badge">New</span>
              </Link>
            </li>
            <li>
              <Link to={'/connections'}>Connections</Link>
            </li>
            <li>
              <Link onClick={handleLogout}>Logout</Link>
            </li>
          </ul>
        </div>
       <Link to={'/requests'}><span className="text-xl ml-2 relative bg-gray-200/50 w-10 h-10 rounded-full flex justify-center items-center">
           🔔
           <span className="absolute -top-2 font-semibold text-red-500 text-sm left-6">{request ? request.length : 0}</span>
          </span>
          </Link> 
      </div>
    </div>
  );
};

export default Navbar
