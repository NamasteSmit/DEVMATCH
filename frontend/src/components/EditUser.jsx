import axios from "axios";
import { useState } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { addUser } from "../redux/userSlice";

const EditUser = ({ setIsEditable, user }) => {
  const [firstname, setFirstname] = useState(user.firstname);
  const [lastname, setLastname] = useState(user.lastname);
  const [about, setAbout] = useState(user.about);
  const [skill, setSkills] = useState([user.skills]);
  const [gender, setGender] = useState(user.gender);
  const [age, setAge] = useState(user.age);
  const [photoUrl, setPhotoUrl] = useState(user.photoUrl);
  const [showToast, setShowToast] = useState(false);
    const [preview, setPreview] = useState("");
    const [loading , setLoading] = useState(false);

    console.log('photototototot : ' , photoUrl)

  console.log("toast...",showToast)
  const dispatch = useDispatch();

  const handleUploadImage = async (e) => {
  try {
    setLoading(true)
    const file = e.target.files[0];
    if (!file) return;

    // preview
    const localPreview = URL.createObjectURL(file);
    setPreview(localPreview);

    const formData = new FormData();
    formData.append("file", file);

    const res = await axios.post(
      `${BASE_URL}/api/v1/image/upload-image`,
      formData
    );

    const imageUrl = res.data.image.secure_url;

    setPhotoUrl(imageUrl);

    console.log("Uploaded:", imageUrl);

    setTimeout(()=>{
      setLoading(false);
    },500)

  } catch (err) {
    console.error("Upload failed", err);
  }
};


  const handleChanges = async () => {
    const response = await axios.patch(
      BASE_URL + "/api/v1/profile/edit",
      {
        firstname: firstname,
        lastname: lastname,
        about: about,
        age: Number(age),
        gender: gender,
        skills: Array.isArray(skill) ? skill.join(",") : skill ?? "",
        photoUrl: photoUrl,
      },
      { withCredentials: true }
    );
    dispatch(addUser(response.data.user));
    setIsEditable(false);
  };

  return (
    <div className="relative w-full max-w-md bg-white flex flex-col items-start space-y-4 rounded-2xl shadow-xl px-8 py-4 pb-8 text-center">
      <h1 className="text-2xl font-bold">Edit</h1>

      <form className=" w-full h-full flex flex-col gap-2">
        <div className="flex flex-col items-start">
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Firstname
          </label>
          <input
            type="text"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={firstname}
            onChange={(e) => setFirstname(e.target.value)}
            required
          />
        </div>
        <div className="flex flex-col items-start">
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Lastname
          </label>
          <input
            type="text"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={lastname}
            onChange={(e) => setLastname(e.target.value)}
            required
          />
        </div>
        <div className="flex flex-col items-start">
          <label className="block mb-1 text-sm font-medium text-gray-700">
            PhotoUrl
          </label>
          <input
            type="file"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleUploadImage}
            required
          />
          {preview && (
              <img
                src={preview}
                alt="Preview"
                className="w-10 h-10 rounded-full object-cover"
              />
            )}
        </div>
        <div className="flex flex-col items-start">
          <label className="block mb-1 text-sm font-medium text-gray-700">
            skills
          </label>
          <input
            type="text"
            className="w-full px-4  py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={skill}
            onChange={(e) => setSkills(e.target.value)}
            required
          />
        </div>
        <div className="flex flex-col items-start">
          <label className="block mb-1 text-sm font-medium text-gray-700">
            About
          </label>
          <input
            type="text"
            className="w-full px-4  py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            required
          />
        </div>
        <div className="flex gap-2 mt-1">
          <div className="flex flex-col items-start">
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Age
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col items-start">
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Gender
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              required
            />
          </div>
        </div>
      </form>

      {/* Button */}
      <button
      disabled = {loading}
        onClick={handleChanges}
        type="submit"
        className="disabled:cursor-not-allowed  mt-6 px-6 py-2 rounded-full bg-gradient-to-r from-pink-500 to-orange-400 text-white font-semibold shadow hover:scale-105 transition-transform"
      >
        Save Changes
      </button>
    </div>
  );
};

export default EditUser;
