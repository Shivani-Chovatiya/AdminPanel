import React, { useState } from "react";

const Performance = () => {
  const therapists = [
    "Rajesh Kumar",
    "Alyvia Kelley",
    "Jaiden Nixon",
    "Ace Foley",
  ];

  const [selected, setSelected] = useState("");

  return (
    <div className="bg-white p-6 md:p-8 rounded-xl shadow w-full">
      <h2 className="text-lg font-semibold mb-4">Manage Availability</h2>

      {/* Select Therapist */}
      <div className="mb-6">
        <label className="text-sm text-gray-600 mb-1 block">
          Select Therapist
        </label>
        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className="w-full border rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-orange-400 outline-none"
        >
          <option value="">Add Name</option>
          {therapists.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1 */}
        <div className="bg-gray-50 p-5 rounded-xl">
          <p className="text-sm text-gray-500">Total Sessions</p>
          <div className="flex items-center justify-between mt-2">
            <h3 className="text-xl font-semibold">232</h3>
            <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
              ↑ 20%
            </span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-gray-50 p-5 rounded-xl">
          <p className="text-sm text-gray-500">Average Rating</p>
          <div className="flex items-center justify-between mt-2">
            <h3 className="text-xl font-semibold">4.5</h3>
            <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
              ↑ 15%
            </span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-gray-50 p-5 rounded-xl">
          <p className="text-sm text-gray-500">Monthly Revenue</p>
          <div className="flex items-center justify-between mt-2">
            <h3 className="text-xl font-semibold">₹43,162</h3>
            <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
              ↑ 12%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Performance;
