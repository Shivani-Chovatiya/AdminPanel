// import React from "react";

// const Input = ({ label, placeholder }) => (
//   <div>
//     <label className="block text-sm mb-1">{label}</label>
//     <input
//       type="text"
//       placeholder={placeholder}
//       className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
//     />
//   </div>
// );
// const AddTherapistForm = () => {
//   return (
//     <div className="bg-white p-6 md:p-8 rounded-xl shadow w-full">
//       <h2 className="text-lg font-semibold mb-6">Basic Information</h2>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//         <Input label="Name" placeholder="Add Name" />
//         <Input label="RCI Registration" placeholder="Add" />

//         <Input label="Email" placeholder="Add Email" />
//         <Input label="Phone" placeholder="Add Number" />

//         <Input label="Service Type" placeholder="Add Type" />
//         <Input label="Qualifications" placeholder="Add Qualifications" />

//         <Input label="Specialisations" placeholder="Add Specialisations" />
//         <Input label="Bio" placeholder="Add Bio" />

//         <Input label="Languages" placeholder="Add Languages" />
//       </div>

//       <div className="mt-10 flex justify-center">
//         <button className="bg-primary hover:bg-orange-600 text-white px-12 py-2 rounded-lg">
//           Save
//         </button>
//       </div>
//     </div>
//   );
// };

// export default AddTherapistForm;
import React, { useEffect, useState } from "react";
import Availability from "./Availability";
import { Plus, X } from "lucide-react";
import { db, storage } from "../config/firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  updateDoc,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { toast } from "react-toastify";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigate, useParams } from "react-router-dom";
import Switch from "react-switch";

const languageOptions = [
  "English",
  "Hindi",
  "Assamese",
  "Bengali",
  "Bodo",
  "Dogri",
  "Gujarati",
  "Kannada",
  "Kashmiri",
  "Konkani",
  "Maithili",
  "Malayalam",
  "Manipuri",
  "Marathi",
  "Nepali",
  "Odia",
  "Punjabi",
  "Sanskrit",
  "Santhali",
  "Sindhi",
  "Tamil",
  "Telugu",
  "Urdu",
];
const AddTherapistForm = ({ therapistid }) => {
  console.log(therapistid);
  const { id } = useParams();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [experience, setExperience] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [specializations, setSpecializations] = useState([]);
  const [newItem, setNewItem] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [price, setPrice] = useState("");
  const [usdPrice, setUsdPrice] = useState("");
  const [bio, setBio] = useState("");
  const [languages, setLanguages] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [qualifications, setQualifications] = useState("");
  const [status, setStatus] = useState("Active");
  const [loading, setLoading] = useState(false);
  const [slots, setSlots] = useState([]);

  useEffect(() => {
    if (!id && !therapistid) return; // if no id → add mode

    const fetchTherapist = async () => {
      try {
        const finalid = therapistid || id;
        const docRef = doc(db, "therapists", finalid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();

          setName(data.name || "");
          setPhone(data.phone || "");
          setEmail(data.email || "");
          setExperience(data.experience || "");
          setPassword(data.password || "");
          setServiceType(data.serviceType || "");
          setPrice(data.price || "");
          setUsdPrice(data.usdPrice || "");
          setSpecializations(data.specializations || []);
          setBio(data.bio || "");
          setLanguages(data.languages || []);
          setQualifications(data.qualifications || "");
          setSlots(data.slots || []);
          setImagePreview(data.imageUrl || null);
          setStatus(data.status || "Active");
        }
      } catch (error) {
        console.log(error);
        toast.error("Failed to fetch therapist data");
      }
    };

    fetchTherapist();
  }, [id, therapistid]);
  const removeItem = (item) => {
    setSpecializations(specializations.filter((spec) => spec !== item));
  };

  const addItem = () => {
    if (newItem.trim() === "") return;
    setSpecializations([...specializations, newItem]);
    setNewItem("");
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Max file size is 2MB");
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };
  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }

    if (!phone.trim()) {
      toast.error("Phone number is required");
      return;
    }

    // ✅ Indian phone validation
    const phoneRegex = /^[6-9]\d{9}$/;

    if (!phoneRegex.test(phone)) {
      toast.error("Enter a valid 10-digit Indian mobile number");
      return;
    }
    if (!email.trim()) {
      toast.error("Email is required");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Enter a valid email");
      return;
    }

    if (!password.trim()) {
      toast.error("Password is required");
      return;
    }
    if (!serviceType) {
      toast.error("Service type is required");
      return;
    }

    if (!price || Number(price) <= 0) {
      toast.error("Valid price is required");
      return;
    }

    if (!usdPrice || Number(usdPrice) <= 0) {
      toast.error("Valid USD price is required");
      return;
    }

    if (!specializations || specializations.length === 0) {
      toast.error("Please select at least one specialization");
      return;
    }

    if (!languages || languages.length === 0) {
      toast.error("Please select at least one language");
      return;
    }

    if (!qualifications.trim()) {
      toast.error("Qualifications are required");
      return;
    }

    if (!experience.trim()) {
      toast.error("Experience is required");
      return;
    }

    if (!bio.trim()) {
      toast.error("Bio is required");
      return;
    }

    if (!id && !imageFile && !therapistid) {
      toast.error("Profile image is required");
      return;
    }

    if (!slots || slots.length === 0) {
      toast.error("Please add at least one availability slot");
      return;
    }
    // 🔍 Check if email already exists
    const q = query(collection(db, "therapists"), where("email", "==", email));

    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      // If updating, allow same email for same document
      const existingDoc = querySnapshot.docs[0];

      if (!therapistid && !id && existingDoc.id !== id) {
        toast.error("A therapist with this email already exists ❌");
        setLoading(false);
        return;
      }
    }

    try {
      setLoading(true);

      let imageUrl = imagePreview || "";

      // Upload new image only if selected
      if (imageFile) {
        const imageRef = ref(
          storage,
          `therapists/${Date.now()}_${imageFile.name}`,
        );

        await uploadBytes(imageRef, imageFile);
        imageUrl = await getDownloadURL(imageRef);
      }
      console.log(usdPrice);
      const therapistData = {
        name,
        phone,
        email,
        password,
        serviceType,
        price: Number(price),
        usdPrice: Number(usdPrice),
        specializations,
        bio,
        languages,
        qualifications,
        imageUrl,
        slots,
        status,
        experience,
        type: "normal",
      };
      console.log(therapistData);
      if (id || therapistid) {
        const finalid = therapistid || id;
        // ✅ UPDATE MODE
        await updateDoc(doc(db, "therapists", finalid), therapistData);
        toast.success("Therapist updated successfully ✅");
      } else {
        // ✅ ADD MODE
        await addDoc(collection(db, "therapists"), {
          ...therapistData,
          createdAt: serverTimestamp(),
        });
        toast.success("Therapist added successfully ✅");
      }

      if (therapistid) {
        navigate("/therapist/dashboard");
      } else {
        navigate("/therapist");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong ❌");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="bg-gray-200 min-h-screen p-3 flex flex-col gap-2">
      {!therapistid && (
        <div>
          <button
            className="bg-white rounded-2xl px-6 py-2 text-black border border-primary"
            onClick={() => navigate("/therapist")}
          >
            {"< Back"}
          </button>
        </div>
      )}
      <div className=" p-6 bg-white border border-gray-300 rounded-2xl shadow-sm flex flex-col md:flex-row items-center md:gap-5">
        {/* Profile Picture */}
        <div className="relative w-24 h-24 md:w-32 md:h-32 mb-4">
          <img
            src={imagePreview || "/profile-placeholder.jpg"}
            alt="Profile"
            className="w-full h-full rounded-2xl object-cover border-4 border-gray-100 shadow"
          />
          {/* Green status/badge */}
          <div className="absolute bottom-0 right-0 w-6 h-6 md:w-8 md:h-8 bg-green-500 border-2 border-white rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">+</span>
          </div>
        </div>

        {/* Upload Text */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-1">
            Upload New Photo
          </h2>
          <p className="text-sm text-gray-500 text-center mb-4">
            JPG, PNG or GIF. Max size 2MB
          </p>

          {/* Upload Button */}
          <label className="cursor-pointer bg-orange-600 hover:bg-orange-700 text-white px-5 py-2 rounded-lg transition">
            Choose File
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
        </div>
      </div>
      <div className=" p-6 bg-white border border-gray-300 rounded-2xl shadow-sm    items-center md:gap-5">
        <h1 className=" text-black  font-bold text-xl">Basic Information</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div className="flex flex-col">
            <label className="text-gray-700 font-medium mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-gray-700 font-medium mb-1">
              Phone Number
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter your phone number"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-gray-700 font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col">
            <label className="text-gray-700 font-medium mb-1">Password</label>
            <input
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>
        </div>
      </div>
      <div className=" p-6 bg-white border border-gray-300 rounded-2xl shadow-sm    items-center md:gap-5">
        <h1 className=" text-black  font-bold text-xl">
          Professional Information
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          <div className="flex flex-col">
            <label className="text-gray-700 font-medium mb-1">
              Service Type
            </label>
            {/* <input
              type="text"
              value={serviceType}
              onChange={(e) => setServiceType(e.target.value)}
              placeholder="Enter your Service Type"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
            /> */}
            <select
              value={serviceType}
              onChange={(e) => setServiceType(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
            >
              <option value="">Select Service</option>
              <option value="Individual Therapy">Individual Therapy</option>
              <option value="Couple Therapy">Couple Therapy</option>
            </select>
          </div>

          {/* INR Price */}
          <div className="flex flex-col">
            <label className="text-gray-700 font-medium mb-1">
              Price Per Session (Indian)
            </label>

            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                ₹
              </span>

              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                onWheel={(e) => e.target.blur()}
                placeholder="Enter Price"
                className="w-full border border-gray-300 rounded-lg pl-8 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>
          </div>

          {/* USD Price */}
          <div className="flex flex-col">
            <label className="text-gray-700 font-medium mb-1">
              Price Per Session (USD)
            </label>

            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                $
              </span>

              <input
                type="number"
                value={usdPrice}
                step="1"
                onWheel={(e) => e.target.blur()}
                onChange={(e) => setUsdPrice(e.target.value)}
                placeholder="Enter Price"
                className="w-full border border-gray-300 rounded-lg pl-8 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {/* Status */}
          <div className="flex flex-col gap-2">
            <label className="text-gray-700 font-medium">Status</label>

            <div className="flex items-center gap-3">
              <Switch
                checked={status === "Active"}
                onChange={(checked) =>
                  setStatus(checked ? "Active" : "Inactive")
                }
                onColor="#22C55E"
                offColor="#E5E7EB"
                uncheckedIcon={false}
                checkedIcon={false}
                height={22}
                width={48}
              />

              <span className="text-sm font-medium">
                {status === "Active" ? "Active" : "Inactive"}
              </span>
            </div>
          </div>

          {/* Experience */}
          <div className="flex flex-col">
            <label className="text-gray-700 font-medium mb-1">Experience</label>
            <input
              type="text"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              placeholder="Enter your experience"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>
        </div>
        <div className="mt-3">
          {/* Title */}
          <h2 className="text-lg font-semibold ">Specialization</h2>

          {/* Tags */}
          <div className="flex flex-wrap gap-3 mb-4">
            {specializations.map((item, index) => (
              <div
                key={index}
                className="flex items-center bg-gray-200 px-4 py-2 rounded-lg text-sm"
              >
                {item}
                <button
                  onClick={() => removeItem(item)}
                  className="ml-2 text-black"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>

          {/* Input + Add */}
          <div className="flex gap-3 flex-col md:flex-row  items-center justify-center">
            <input
              type="text"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              placeholder="Add specialization..."
              className="flex-1 bg-gray-200 rounded-lg px-4 py-2 outline-none"
            />
            <button
              onClick={addItem}
              className="bg-orange-600 py-3 text-white px-5 rounded-lg flex items-center justify-center"
            >
              <Plus size={18} />
            </button>
          </div>
        </div>

        <div className="flex flex-col mt-3">
          <label className="text-gray-700 font-medium mb-1">Bio</label>
          <textarea
            type="text"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Enter Price Per Session"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>
      </div>
      <div className=" p-6 bg-white border border-gray-300 rounded-2xl shadow-sm    items-center md:gap-5">
        <h1 className=" text-black  font-bold text-xl">Credentials</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {/* <div className="flex flex-col">
            <label className="text-gray-700 font-medium mb-1">Languages</label>
            {/* <input
              type="text"
              value={languages}
              onChange={(e) => setLanguages(e.target.value)}
              placeholder="Enter Languages"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
            /> *
            <select
              value={languages}
              onChange={(e) =>
                setLanguages(
                  Array.from(
                    e.target.selectedOptions,
                    (option) => option.value,
                  ),
                )
              }
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 h-48 overflow-y-auto"
            >
              <option value="English">English</option>
              <option value="Hindi">Hindi</option>
              <option value="Assamese">Assamese</option>
              <option value="Bengali">Bengali</option>
              <option value="Bodo">Bodo</option>
              <option value="Dogri">Dogri</option>
              <option value="Gujarati">Gujarati</option>
              <option value="Kannada">Kannada</option>
              <option value="Kashmiri">Kashmiri</option>
              <option value="Konkani">Konkani</option>
              <option value="Maithili">Maithili</option>
              <option value="Malayalam">Malayalam</option>
              <option value="Manipuri">Manipuri</option>
              <option value="Marathi">Marathi</option>
              <option value="Nepali">Nepali</option>
              <option value="Odia">Odia</option>
              <option value="Punjabi">Punjabi</option>
              <option value="Sanskrit">Sanskrit</option>
              <option value="Santhali">Santhali</option>
              <option value="Sindhi">Sindhi</option>
              <option value="Tamil">Tamil</option>
              <option value="Telugu">Telugu</option>
              <option value="Urdu">Urdu</option>
            </select>
          </div> */}
          <div>
            <label className="block text-sm font-medium mb-2">Languages</label>

            {/* Dropdown */}
            <select
              value={selectedLanguage}
              onChange={(e) => {
                const value = e.target.value;
                if (value && !languages.includes(value)) {
                  setLanguages([...languages, value]);
                }
                setSelectedLanguage("");
              }}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
            >
              <option value="">Select Language</option>
              {languageOptions.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>

            {/* Selected Tags */}
            <div className="flex flex-wrap gap-2 mt-3">
              {languages.map((lang) => (
                <div
                  key={lang}
                  className="flex items-center bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm"
                >
                  {lang}
                  <button
                    onClick={() =>
                      setLanguages(languages.filter((item) => item !== lang))
                    }
                    className="ml-2 text-orange-500 hover:text-red-500"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col">
            <label className="text-gray-700 font-medium mb-1">
              Qualifications
            </label>
            <input
              type="text"
              value={qualifications}
              onChange={(e) => setQualifications(e.target.value)}
              placeholder="Enter your Qualifications"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>
        </div>
      </div>
      <div className=" p-6 bg-white border border-gray-300 rounded-2xl shadow-sm    items-center md:gap-5">
        <h1 className=" text-black  font-bold text-xl">Current Availability</h1>
        <Availability slots={slots} setSlots={setSlots} />
      </div>
      <div className="mt-10 mb-14 flex justify-center">
        <button
          onClick={handleSave}
          disabled={loading}
          className="bg-primary hover:bg-orange-600 text-white px-12 py-2 rounded-lg"
        >
          {loading
            ? id || therapistid
              ? "Updating..."
              : "Saving..."
            : id || therapistid
              ? "Update"
              : "Save"}
        </button>
      </div>
    </div>
  );
};

export default AddTherapistForm;
