import React from "react";
import { FaUser } from "react-icons/fa";

const OverallPerformance = () => {
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="font-semibold mb-4">Overall Performance</h2>

      <div className="flex flex-col items-center justify-center">
        <div className="relative w-40 h-40">
          <div className="absolute inset-0 rounded-full border-8 border-gray-200"></div>
          <div className="absolute inset-0 rounded-full border-8 border-orange-500 border-t-transparent rotate-45"></div>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <FaUser className="text-orange-500 text-xl" />
            <p className="text-xl font-bold mt-1">350</p>
            <p className="text-sm text-gray-400">Excellent</p>
          </div>
        </div>

        <button className="mt-4 text-orange-500 text-sm font-medium">
          View Details
        </button>
      </div>
    </div>
  );
};

export default OverallPerformance;
