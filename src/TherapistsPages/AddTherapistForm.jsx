import React from "react";

const Input = ({ label, placeholder }) => (
  <div>
    <label className="block text-sm mb-1">{label}</label>
    <input
      type="text"
      placeholder={placeholder}
      className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
    />
  </div>
);
const AddTherapistForm = () => {
  return (
    <div className="bg-white p-6 md:p-8 rounded-xl shadow w-full">
      <h2 className="text-lg font-semibold mb-6">Basic Information</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Input label="Name" placeholder="Add Name" />
        <Input label="RCI Registration" placeholder="Add" />

        <Input label="Email" placeholder="Add Email" />
        <Input label="Phone" placeholder="Add Number" />

        <Input label="Service Type" placeholder="Add Type" />
        <Input label="Qualifications" placeholder="Add Qualifications" />

        <Input label="Specialisations" placeholder="Add Specialisations" />
        <Input label="Bio" placeholder="Add Bio" />

        <Input label="Languages" placeholder="Add Languages" />
      </div>

      <div className="mt-10 flex justify-center">
        <button className="bg-orange-500 hover:bg-orange-600 text-white px-12 py-2 rounded-lg">
          Save
        </button>
      </div>
    </div>
  );
};

export default AddTherapistForm;
