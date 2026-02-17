import React, { useState } from "react";
import TherapistsListPage from "../TherapistsPages/TherapistsListPage";
import AddTherapistForm from "../TherapistsPages/AddTherapistForm";
import Availability from "../TherapistsPages/Availability";
import Performance from "../TherapistsPages/Performance";

const TherapistPage = () => {
  const [activeTab, setActiveTab] = useState("Therapists List");
  return (
    <div>
      <h1 className="text-xl md:text-2xl font-bold mb-4">Therapist</h1>
      <div className="bg-white p-6 rounded-2xl shadow">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4  gap-2   p-1 mb-4">
          {[
            "Therapists List",
            "Add New Therapist",
            "Availability",
            "Performance",
          ].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-xl border capitalize shrink-0 text-sm ${
                activeTab === tab
                  ? "bg-orange-500 text-white"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        {activeTab === "Therapists List" ? <TherapistsListPage /> : <></>}
        {activeTab === "Add New Therapist" ? <AddTherapistForm /> : <></>}
        {activeTab === "Availability" ? <Availability /> : <></>}
        {activeTab === "Performance" ? <Performance /> : <></>}
      </div>{" "}
    </div>
  );
};

export default TherapistPage;
