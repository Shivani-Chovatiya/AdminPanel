import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-100  flex items-center justify-center px-4">
      {/* Main White Container */}
      <div className="w-full max-w-5xl  rounded-md py-16 flex flex-col items-center">
        {/* Title */}
        <h2 className="text-lg font-semibold text-gray-700 mb-8">AdminPanel</h2>

        {/* Login Card */}
        <div className="bg-white w-full max-w-sm rounded-xl shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-800">Welcome back</h3>
          <p className="text-sm text-gray-500 mb-6">
            Enter your credentials to access the admin panel.
          </p>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-sm text-gray-600 mb-1">
              Email Address
            </label>
            <input
              type="email"
              placeholder="name@company.com"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          {/* Password */}
          <div className="mb-3">
            <div className="flex justify-between items-center mb-1">
              <label className="text-sm text-gray-600">Password</label>
              <button className="text-xs text-orange-500 hover:underline">
                Forgot password?
              </button>
            </div>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 pr-10"
              />

              {/* Toggle Icon */}
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-gray-400 cursor-pointer"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

          {/* Button */}
          <button
            onClick={() => {
              navigate("/dashboard/analytics");
              // navigate("/therapist/dashboard");
            }}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white py-2 rounded-md font-medium transition duration-200"
          >
            Sign In →
          </button>
          <button
            onClick={() => {
              // navigate("/dashboard/analytics")
              navigate("/therapist/dashboard");
            }}
            className="mt-5 w-full bg-orange-600 hover:bg-orange-700 text-white py-2 rounded-md font-medium transition duration-200"
          >
            Therapist Panel(Testing..)
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
