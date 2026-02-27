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
import React, { useState } from "react";
import Availability from "./Availability";

const AddTherapistForm = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  return (
    <div className="bg-gray-200 min-h-screen p-3 flex flex-col gap-2">
      <div className=" p-6 bg-white border border-gray-300 rounded-2xl shadow-sm flex flex-col md:flex-row items-center md:gap-5">
        {/* Profile Picture */}
        <div className="relative w-24 h-24 md:w-32 md:h-32 mb-4">
          <img
            src="/profile-placeholder.jpg" // replace with your default/profile image
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
            <input type="file" className="hidden" />
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
        </div>
      </div>
      <div className=" p-6 bg-white border border-gray-300 rounded-2xl shadow-sm    items-center md:gap-5">
        <h1 className=" text-black  font-bold text-xl">
          Professional Information
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div className="flex flex-col">
            <label className="text-gray-700 font-medium mb-1">
              Service Type
            </label>
            <input
              type="text"
              // value={name}
              // onChange={(e) => setName(e.target.value)}
              placeholder="Enter your Service Type"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-gray-700 font-medium mb-1">
              Price Per Session
            </label>
            <input
              type="text"
              // value={phone}
              // onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter Price Per Session"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-gray-700 font-medium mb-1">Bio</label>
            <textarea
              type="text"
              // value={phone}
              // onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter Price Per Session"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>
        </div>
      </div>
      <div className=" p-6 bg-white border border-gray-300 rounded-2xl shadow-sm    items-center md:gap-5">
        <h1 className=" text-black  font-bold text-xl">Credentials</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div className="flex flex-col">
            <label className="text-gray-700 font-medium mb-1">Languages</label>
            <input
              type="text"
              // value={name}
              // onChange={(e) => setName(e.target.value)}
              placeholder="Enter Languages"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-gray-700 font-medium mb-1">
              Qualifications
            </label>
            <input
              type="text"
              // value={phone}
              // onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter your Qualifications"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>
        </div>
      </div>
      <div className=" p-6 bg-white border border-gray-300 rounded-2xl shadow-sm    items-center md:gap-5">
        <h1 className=" text-black  font-bold text-xl">Current Availability</h1>
        <Availability />
      </div>
      <div className="mt-10 mb-14 flex justify-center">
        <button className="bg-primary hover:bg-orange-600 text-white px-12 py-2 rounded-lg">
          Save
        </button>
      </div>
    </div>
  );
};

export default AddTherapistForm;
