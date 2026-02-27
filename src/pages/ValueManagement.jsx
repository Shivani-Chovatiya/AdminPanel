import { PlusCircle } from "lucide-react";
import React from "react";

const ValueManagement = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="p-2 md:p-6 ">
        <h1 className="text-black font-bold text-xl">System Configuration</h1>
        <p className="text-gray-400 text-xs ">
          Manage global enterprise settings, credit rules, and service packages.
        </p>
      </div>
      <div className="p-2 md:p-6 flex flex-col gap-5">
        <div className="bg-white shadow-xl rounded-xl p-2 md:p-4">
          <div>
            <h1 className="text-black font-bold text-xl">Credit Pricing</h1>
            <p className="text-gray-400 text-xs ">
              Set the unit price for credits across different geographical
              regions.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-5">
            <div className="flex flex-col">
              <label className="text-gray-700 font-medium mb-1">
                1 Credit - India (Domestic)
              </label>
              <input
                type="text"
                //   value={name}
                //   onChange={(e) => setName(e.target.value)}
                placeholder="Enter your amount"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-gray-700 font-medium mb-1">
                1 Credit - International
              </label>
              <input
                type="text"
                //   value={phone}
                //   onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter your amount"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>
          </div>
          <div className="flex justify-center items-center">
            <button className="w-full md:w-1/4 bg-primary mt-3 hover:bg-orange-700 text-white py-2 rounded-md font-medium transition duration-200">
              Save Changes
            </button>
          </div>
        </div>
        <div className="bg-white shadow-xl rounded-xl p-3 md:p-4">
          <div>
            <div className="flex justify-between">
              <h1 className="text-black font-bold text-xl">
                Question Packages
              </h1>
              <button className="text-primary font-bold text-xs flex gap-1 mt-1">
                <PlusCircle className="w-4 h-4 text-primary" /> Create Package
              </button>
            </div>
            <p className="text-gray-400 text-xs ">
              Manage bulk question tiers and their active pricing strategies.
            </p>
          </div>
        </div>
        <div className="bg-white shadow-xl rounded-xl p-3 md:p-4">
          <div>
            <div className="flex justify-between">
              <h1 className="text-black font-bold text-xl">
                Counselling Packages
              </h1>
              <button className="text-primary font-bold text-xs flex gap-1 mt-1">
                <PlusCircle className="w-4 h-4 text-primary" /> Add Package
              </button>
            </div>
            <p className="text-gray-400 text-xs ">
              Manage therapeutic counselling session bundles.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ValueManagement;
