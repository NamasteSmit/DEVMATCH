import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { Navigate } from "react-router-dom";
const SignupPage = () => {

    const navigate = useNavigate();

 const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [skills, setSkills] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [about, setAbout] = useState("");

  const [errors ,setErrors] = useState({});
   console.log("errors",errors)
  
  const handleSignup = async(e)=>{
    e.preventDefault();
    setErrors({})
    try{
        const response = await axios.post(BASE_URL+"/api/v1/user/signup",{
        firstname : firstname,
        lastname : lastname,
        emailId : emailId,
        password : password,
        age : age,
        about : about,
        gender : gender,
        skills : skills.split(',').map(s=>s.trim()),
        photoUrl : photoUrl,
    })
    console.log("signup response",response)
    if(response.data.success){
        return navigate('/login');
    }

    }catch(err){
       console.log("-->",err.response.data);

       if(err?.response?.data?.field==="exists"){
        setErrors({"email" : err.response.data.message})
       }

       const apiErrors = err?.response?.data?.message; // or error?.data?.message based on your setup

     if (Array.isArray(apiErrors)) {
    const formattedErrors = {};
    apiErrors.forEach(err => {
      const field = err.path[0]; // like 'firstname', 'lastname'
      formattedErrors[field] = err.message;
    });

    setErrors(formattedErrors);
  }
    }
  }
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-center text-3xl font-bold text-gray-900 mb-6">
          Create your account
        </h2>
        <form className="space-y-4" onSubmit={handleSignup}>
          <div className="flex gap-4">
            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-700">First Name</label>
              <input
                name="firstname"
                type="text"
                value={firstname}
                onChange={(e)=>setFirstname(e.target.value)}
                className="mt-1 px-2 block w-full border-gray-300 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              />
              {errors.firstname && <p className="text-red-500 text-sm mt-1">{errors.firstname}</p>}
            </div>
            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-700">Last Name</label>
              <input
                name="lastname"
                type="text"
                value={lastname}
                onChange={(e)=>setLastname(e.target.value)}
                className="mt-1 px-2 block w-full border-gray-300 border  rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              />
              {errors.lastname && <p className="text-red-500 text-sm  mt-1">{errors.lastname}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email Address</label>
            <input
              name="emailId"
              type="email"
              value={emailId}
              onChange={(e)=>setEmailId(e.target.value)}
              className="mt-1 px-2 block w-full border-gray-300 border  rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
             {errors.email && <p className="text-red-500 text-sm  mt-1">{errors.email}</p>}

          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              name="password"
              type="password"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
              className="mt-1 px-2 block w-full border-gray-300 border  rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
            {errors.password && <p className="text-red-500 text-sm  mt-1">{errors.password}</p>}
          </div>

          <div className="flex gap-4">
            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-700">Age</label>
              <input
                name="age"
                type="number"
                value={age}
                onChange={(e)=>setAge(e.target.value)}
                className="mt-1 px-2 block w-full border-gray-300 border  rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-700">Gender</label>
              <select
                name="gender"
                value={gender}
                onChange={(e)=>setGender(e.target.value)}
                className="mt-1 block w-full border-gray-300 border  rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Skills (comma-separated)</label>
            <input
              name="skills"
              type="text"
              value={skills}
              onChange={(e)=>setSkills(e.target.value)}
              placeholder="e.g. React, Node.js, MongoDB"
              className="mt-1 px-2 block w-full border-gray-300 border  rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Photo URL</label>
            <input
              name="photoUrl"
              type="url"
              value={photoUrl}
              onChange={(e)=>setPhotoUrl(e.target.value)}
              placeholder="https://your-photo-url.com"
              className="mt-1 px-2 block w-full border-gray-300 border  rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">About</label>
            <textarea
              name="about"
              rows="4"
              value={about}
              onChange={(e)=>setAbout(e.target.value)}
              placeholder="Tell us about yourself..."
              className="mt-1 px-2 block w-full border border-gray-300   rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow-sm transition"
            >
              Sign Up
            </button>
          </div>
        </form>
        <p className="text-sm font-semibold text-center mt-2">Already a User ? <Link to={'/login'}><span className="text-blue-500">Login</span></Link></p>
      </div>
    </div>
  );
};

export default SignupPage;
