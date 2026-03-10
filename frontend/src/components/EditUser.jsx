import axios from "axios";
import { useState } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { addUser } from "../redux/userSlice";

const EditUser = ({ setIsEditable, user }) => {

  const [firstname, setFirstname] = useState(user.firstname);
  const [lastname, setLastname] = useState(user.lastname);
  const [about, setAbout] = useState(user.about);
  const [skill, setSkills] = useState(user.skills?.join(", ") || "");
  const [gender, setGender] = useState(user.gender);
  const [age, setAge] = useState(user.age);
  const [photoUrl, setPhotoUrl] = useState(user.photoUrl);
  const [preview, setPreview] = useState(user.photoUrl || "");
  const [loading , setLoading] = useState(false);

  const dispatch = useDispatch();

  const handleUploadImage = async (e) => {
    try {

      const file = e.target.files[0];
      if (!file) return;

      setLoading(true);

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

      setLoading(false);

    } catch (err) {
      console.error("Upload failed", err);
      setLoading(false);
    }
  };


  const handleChanges = async (e) => {

    e.preventDefault();

    try {

      const response = await axios.patch(
        `${BASE_URL}/api/v1/profile/edit`,
        {
          firstname,
          lastname,
          about,
          age: Number(age),
          gender,
          photoUrl,                    
          skills: skill.split(",").map(s => s.trim())
        },
        { withCredentials: true }
      );

      dispatch(addUser(response.data.user));
      setIsEditable(false);

    } catch (err) {
      console.error("Save failed", err);
    }
  };

  return (
    <div className="relative w-full max-w-md bg-white flex flex-col items-start space-y-4 rounded-2xl shadow-xl px-8 py-4 pb-8 text-center">
      <h1 className="text-2xl font-bold">Edit</h1>

      <form
        onSubmit={handleChanges}
        className="w-full flex flex-col gap-2"
      >

        <input
          type="text"
          value={firstname}
          onChange={(e)=>setFirstname(e.target.value)}
          className="border p-2"
        />

        <input
          type="text"
          value={lastname}
          onChange={(e)=>setLastname(e.target.value)}
          className="border p-2"
        />

        <input
          type="file"
          onChange={handleUploadImage}
        />

        {preview && (
          <img
            src={preview}
            alt="preview"
            className="w-12 h-12 rounded-full"
          />
        )}

        <input
          type="text"
          value={skill}
          onChange={(e)=>setSkills(e.target.value)}
          className="border p-2"
        />

        <input
          type="text"
          value={about}
          onChange={(e)=>setAbout(e.target.value)}
          className="border p-2"
        />

        <input
          type="number"
          value={age}
          onChange={(e)=>setAge(e.target.value)}
          className="border p-2"
        />

        <input
          type="text"
          value={gender}
          onChange={(e)=>setGender(e.target.value)}
          className="border p-2"
        />

        <button
          disabled={loading}
          className="bg-blue-500 text-white p-2 rounded"
        >
          {loading ? "Uploading..." : "Save Changes"}
        </button>

      </form>
    </div>
  );
};

export default EditUser;