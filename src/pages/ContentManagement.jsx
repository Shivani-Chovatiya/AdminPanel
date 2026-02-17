import React, { useState } from "react";
import MotivatingLinePage from "../ContentmanagementPages/MotivatingLinePage";
import ReviewPage from "../ContentmanagementPages/ReviewPage";
import FreeAssessmentsPage from "../ContentmanagementPages/FreeAssessmentsPage";
import ClarifyPage from "../ContentmanagementPages/ClarifyPage";
import RecoveryFactsPage from "../ContentmanagementPages/RecoveryFactsPage";

const ContentManagement = () => {
  const [activeTab, setActiveTab] = useState("Motivating Lines");
  return (
    <div>
      <h1 className="text-xl md:text-2xl font-bold mb-4">Content Management</h1>
      <div className="bg-white p-6 rounded-2xl shadow">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5  gap-2   p-1 mb-4">
          {[
            "Motivating Lines",
            "Reviews",
            "Free Assessments",
            "Clarify",
            "Recovery Facts",
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
        {activeTab === "Motivating Lines" ? <MotivatingLinePage /> : <></>}
        {activeTab === "Reviews" ? <ReviewPage /> : <></>}
        {activeTab === "Free Assessments" ? <FreeAssessmentsPage /> : <></>}
        {activeTab === "Clarify" ? <ClarifyPage /> : <></>}
        {activeTab === "Recovery Facts" ? <RecoveryFactsPage /> : <></>}
      </div>{" "}
    </div>
  );
};

export default ContentManagement;
